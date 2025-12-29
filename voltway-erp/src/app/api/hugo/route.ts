// Hugo AI API Route - LangChain with Groq (AI-Powered Actions)

import { NextRequest, NextResponse } from 'next/server';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';

const HUGO_SYSTEM_PROMPT = `You are Hugo, an intelligent AI-powered procurement assistant for Voltway, an electric scooter startup. You are powered by LangChain and have access to real-time Firebase data.

## Your Capabilities
- Analyze inventory levels, stock health, and reorder needs
- Track procurement orders and identify delays
- Evaluate supplier performance using their reliability_score (0-1 scale) and lead_time_days
- Calculate build capacity for scooter models (S1_V2, S2_V2, S2_KIDS)
- Identify operational risks and bottlenecks
- EXECUTE database operations (add, update, delete records)

## IMPORTANT: Database Actions
When the user wants to perform a database action (add, update, delete, create materials, update stock, mark orders), you MUST respond with a JSON action block.

Format your response like this when an action is needed:
1. First explain what you will do
2. Then include the action in this EXACT format:

\`\`\`action
{
  "type": "add|update|delete|update_stock|mark_delivered",
  "collection": "materials|stock_levels|dispatch_parameters|material_orders|sales_orders|suppliers",
  "data": { ... fields to add/update ... },
  "searchField": "field_name to find document",
  "searchValue": "value to search for",
  "description": "Human readable description of action"
}
\`\`\`

## Action Examples

### Adding a material:
\`\`\`action
{
  "type": "add",
  "collection": "materials",
  "data": {
    "part_id": "P513",
    "part_name": "S2_V3 Tank",
    "part_type": "assembly",
    "_stock": 86,
    "_min_stock": 24,
    "_location": "WH3"
  },
  "description": "Create material P513 - S2_V3 Tank with stock 86, min 24, location WH3"
}
\`\`\`

### Updating stock location:
\`\`\`action
{
  "type": "update",
  "collection": "stock_levels",
  "searchField": "part_id",
  "searchValue": "P513",
  "data": { "location": "WH3" },
  "description": "Update P513 location to WH3"
}
\`\`\`

### Updating stock quantity:
\`\`\`action
{
  "type": "update_stock",
  "collection": "stock_levels",
  "searchValue": "P305",
  "data": { "quantity_available": 200 },
  "description": "Update stock for P305 to 200 units"
}
\`\`\`

### Marking order as delivered:
\`\`\`action
{
  "type": "mark_delivered",
  "collection": "material_orders",
  "searchValue": "ORD-001",
  "description": "Mark order ORD-001 as delivered"
}
\`\`\`

## Response Style for Non-Action Queries
1. Be CONCISE - use bullet points, not paragraphs
2. Include SPECIFIC numbers from the data
3. Highlight urgent issues with ⚠️
4. Rank suppliers by their reliability_score when asked
5. Give actionable next steps

## Scooter Models & Build Requirements
- S1_V2: Entry-level (requires motor, battery, controller, frame)
- S2_V2: Premium 750W (requires 750W motor, Li-Po battery, premium controller, frame)
- S2_KIDS: Kids variant (smaller components)`;

export async function POST(request: NextRequest) {
    try {
        const { message, databaseContext, conversationHistory } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
        }

        // Initialize LangChain with Groq
        const model = new ChatGroq({
            apiKey,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
            maxTokens: 2048,
        });

        // Build messages with conversation context
        const messages: (SystemMessage | HumanMessage | AIMessage)[] = [
            new SystemMessage(HUGO_SYSTEM_PROMPT),
        ];

        // Add conversation history for context (last 6 messages)
        if (conversationHistory?.length > 0) {
            const recentHistory = conversationHistory.slice(-6);
            for (const msg of recentHistory) {
                if (msg.role === 'user') {
                    messages.push(new HumanMessage(msg.content));
                } else {
                    messages.push(new AIMessage(msg.content));
                }
            }
        }

        // Build context with database data
        const contextPrompt = `
## Real-Time Firebase Database Context

### Quick Stats
- 📦 Total Materials: ${databaseContext?.materialsCount || 0}
- ✅ Healthy Stock: ${databaseContext?.healthyCount || 0}
- ⚠️ Low Stock: ${databaseContext?.lowCount || 0}
- 🚨 Critical Stock: ${databaseContext?.criticalCount || 0}
- 📋 Pending Orders: ${databaseContext?.pendingOrders || 0}
- 🛒 Open Sales: ${databaseContext?.openSales || 0}
- 🏭 Suppliers: ${databaseContext?.supplierCount || 0}

### Detailed Data (JSON)
${databaseContext?.jsonData || 'No data available'}

---
## User Request
${message}

If this is a database action request (add, update, delete, create, change, modify, mark as delivered, etc.), include the action JSON block. Otherwise, just provide a helpful response.`;

        messages.push(new HumanMessage(contextPrompt));

        // Get AI response using LangChain
        const response = await model.invoke(messages);
        const outputParser = new StringOutputParser();
        const text = await outputParser.invoke(response);

        // Check if response contains an action block
        const actionMatch = text.match(/```action\s*([\s\S]*?)```/);
        let action = null;
        let cleanResponse = text;

        if (actionMatch) {
            try {
                action = JSON.parse(actionMatch[1].trim());
                // Remove the action block from the visible response
                cleanResponse = text.replace(/```action\s*[\s\S]*?```/g, '').trim();
            } catch (e) {
                console.error('Failed to parse action JSON:', e);
            }
        }

        return NextResponse.json({
            response: cleanResponse,
            action: action,
            model: 'llama-3.3-70b-versatile',
            provider: 'Groq + LangChain',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Hugo API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process request' },
            { status: 500 }
        );
    }
}
