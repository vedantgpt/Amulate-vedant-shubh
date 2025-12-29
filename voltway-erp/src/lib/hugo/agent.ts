// Hugo AI Agent - LangChain with Gemini

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { HUGO_SYSTEM_PROMPT, CONTEXT_TEMPLATE } from './prompts';

// Initialize Gemini model
export function createHugoAgent() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set');
    }

    const model = new ChatGoogleGenerativeAI({
        apiKey,
        model: 'gemini-1.5-flash',
        temperature: 0.3,
        maxOutputTokens: 2048,
    });

    return model;
}

// Generate database summary/metadata
export function generateDatabaseMetadata(data: {
    materials: any[];
    stockLevels: any[];
    dispatchParams: any[];
    materialOrders: any[];
    salesOrders: any[];
    suppliers: any[];
}) {
    const { materials, stockLevels, dispatchParams, materialOrders, salesOrders, suppliers } = data;

    // Calculate inventory status
    const getStockStatus = (partId: string) => {
        const stock = stockLevels.find((s: any) => s.part_id === partId);
        const dispatch = dispatchParams.find((d: any) => d.part_id === partId);
        const qty = stock?.quantity_available || 0;
        const minStock = dispatch?.min_stock_level || 50;
        if (qty <= minStock * 0.5) return 'critical';
        if (qty <= minStock) return 'low';
        return 'healthy';
    };

    const materialTypes = [...new Set(materials.map(m => m.part_type))].join(', ');
    const healthyCount = materials.filter(m => getStockStatus(m.part_id) === 'healthy').length;
    const lowCount = materials.filter(m => getStockStatus(m.part_id) === 'low').length;
    const criticalCount = materials.filter(m => getStockStatus(m.part_id) === 'critical').length;
    const pendingOrders = materialOrders.filter((o: any) => o.status !== 'Delivered').length;
    const openSales = salesOrders.filter((o: any) => o.status !== 'Delivered').length;

    // Create detailed JSON for context
    const jsonData = JSON.stringify({
        materials: materials.map(m => ({
            part_id: m.part_id,
            part_name: m.part_name,
            type: m.part_type,
            models: m.used_in_models,
            status: getStockStatus(m.part_id),
            stock: stockLevels.find((s: any) => s.part_id === m.part_id)?.quantity_available || 0,
            location: stockLevels.find((s: any) => s.part_id === m.part_id)?.location || 'N/A',
            min_stock: dispatchParams.find((d: any) => d.part_id === m.part_id)?.min_stock_level || 0,
        })),
        material_orders: materialOrders.map(o => ({
            order_id: o.order_id,
            part_id: o.part_id,
            supplier_id: o.supplier_id,
            quantity: o.quantity,
            status: o.status,
            order_date: o.order_date,
            expected_delivery: o.expected_delivery,
        })),
        sales_orders: salesOrders.map(o => ({
            order_id: o.order_id,
            order_type: o.order_type,
            scooter_model: o.scooter_model,
            quantity: o.quantity,
            status: o.status,
            customer: o.customer_name,
        })),
        suppliers: suppliers.map(s => ({
            supplier_id: s.supplier_id,
            name: s.supplier_name,
            part_id: s.part_id,
            lead_time: s.lead_time_days,
            reliability: s.reliability_score,
            price: s.unit_price,
        })),
    }, null, 2);

    return {
        summary: {
            materialsCount: materials.length,
            materialTypes,
            healthyCount,
            lowCount,
            criticalCount,
            pendingOrders,
            openSales,
            supplierCount: suppliers.length,
        },
        jsonData,
    };
}

// Build context prompt with data
export function buildContextPrompt(
    question: string,
    metadata: ReturnType<typeof generateDatabaseMetadata>
) {
    return CONTEXT_TEMPLATE
        .replace('{materialsCount}', String(metadata.summary.materialsCount))
        .replace('{materialTypes}', metadata.summary.materialTypes)
        .replace('{healthyCount}', String(metadata.summary.healthyCount))
        .replace('{lowCount}', String(metadata.summary.lowCount))
        .replace('{criticalCount}', String(metadata.summary.criticalCount))
        .replace('{pendingOrders}', String(metadata.summary.pendingOrders))
        .replace('{openSales}', String(metadata.summary.openSales))
        .replace('{supplierCount}', String(metadata.summary.supplierCount))
        .replace('{jsonData}', metadata.jsonData)
        .replace('{question}', question);
}

// Chat with Hugo
export async function chatWithHugo(
    question: string,
    databaseData: Parameters<typeof generateDatabaseMetadata>[0]
): Promise<string> {
    try {
        const model = createHugoAgent();
        const metadata = generateDatabaseMetadata(databaseData);
        const contextPrompt = buildContextPrompt(question, metadata);

        const response = await model.invoke([
            new SystemMessage(HUGO_SYSTEM_PROMPT),
            new HumanMessage(contextPrompt),
        ]);

        return response.content as string;
    } catch (error: any) {
        console.error('Hugo AI Error:', error);
        throw new Error(`Failed to get response from Hugo: ${error.message}`);
    }
}

// Detect if user wants to perform an action
export function detectAction(message: string): {
    type: 'query' | 'add' | 'update' | 'delete';
    entity?: string;
    details?: any;
} {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('add') || lowerMsg.includes('create') || lowerMsg.includes('new')) {
        if (lowerMsg.includes('material') || lowerMsg.includes('part')) {
            return { type: 'add', entity: 'material' };
        }
        if (lowerMsg.includes('order')) {
            return { type: 'add', entity: 'order' };
        }
        if (lowerMsg.includes('supplier')) {
            return { type: 'add', entity: 'supplier' };
        }
    }

    if (lowerMsg.includes('update') || lowerMsg.includes('change') || lowerMsg.includes('modify')) {
        if (lowerMsg.includes('stock') || lowerMsg.includes('inventory')) {
            return { type: 'update', entity: 'stock' };
        }
        if (lowerMsg.includes('order')) {
            return { type: 'update', entity: 'order' };
        }
    }

    if (lowerMsg.includes('delete') || lowerMsg.includes('remove')) {
        return { type: 'delete' };
    }

    return { type: 'query' };
}
