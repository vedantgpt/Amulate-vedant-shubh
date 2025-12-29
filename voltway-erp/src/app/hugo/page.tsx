'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { useMaterials, useStockLevels, useDispatchParameters, useMaterialOrders, useSalesOrders, useSuppliers } from '@/lib/useFirestore';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    action?: ActionRequest;
}

interface ActionRequest {
    type: 'add' | 'update' | 'delete' | 'update_stock' | 'mark_delivered' | 'send_email';
    collection: string;
    data?: any;
    searchField?: string;
    searchValue?: string;
    description: string;
}

const STORAGE_KEY = 'hugo_chat_history';

const defaultMessage: Message = {
    id: '1',
    role: 'assistant',
    content: `Hello! I'm Hugo, your AI-powered procurement assistant powered by **LangChain + Groq**.

**I can help you with:**
• Analyzing inventory levels and stock health
• Tracking orders and deliveries
• Evaluating supplier performance
• **Performing database operations** (add, update, delete records)

**Try asking me to:**
• "Update stock for P305 to 150 units"
• "Mark order ORD-001 as delivered"
• "Add a new material with part ID P999"

Ask me anything about your operations!`,
    timestamp: new Date(),
};

export default function HugoPage() {
    const { data: materials } = useMaterials();
    const { data: stockLevels } = useStockLevels();
    const { data: dispatchParams } = useDispatchParameters();
    const { data: materialOrders } = useMaterialOrders();
    const { data: salesOrders } = useSalesOrders();
    const { data: suppliers } = useSuppliers();

    const [messages, setMessages] = useState<Message[]>([defaultMessage]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingAction, setPendingAction] = useState<ActionRequest | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load chat history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const restored = parsed.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp),
                }));
                if (restored.length > 0) {
                    setMessages(restored);
                }
            } catch (e) {
                console.error('Failed to load chat history:', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save chat history to localStorage whenever messages change
    useEffect(() => {
        if (isInitialized && messages.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
    }, [messages, isInitialized]);

    // Clear chat function
    const clearChat = () => {
        setMessages([defaultMessage]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const samplePrompts = [
        'What parts are running low?',
        'Update stock for P305 to 200 units',
        'Mark order ORD-001 as delivered',
        'Which supplier is most reliable?',
        'Add a new material P999',
    ];

    // Calculate database context
    const getDatabaseContext = () => {
        const getStockStatus = (partId: string) => {
            const stock = stockLevels.find((s: any) => s.part_id === partId);
            const dispatch = dispatchParams.find((d: any) => d.part_id === partId);
            const qty = stock?.quantity_available || 0;
            const minStock = dispatch?.min_stock_level || 50;
            if (qty <= minStock * 0.5) return 'critical';
            if (qty <= minStock) return 'low';
            return 'healthy';
        };

        return {
            materialsCount: materials.length,
            healthyCount: materials.filter((m: any) => getStockStatus(m.part_id) === 'healthy').length,
            lowCount: materials.filter((m: any) => getStockStatus(m.part_id) === 'low').length,
            criticalCount: materials.filter((m: any) => getStockStatus(m.part_id) === 'critical').length,
            pendingOrders: materialOrders.filter((o: any) => o.status !== 'Delivered').length,
            openSales: salesOrders.filter((o: any) => o.status !== 'Delivered').length,
            supplierCount: suppliers.length,
            jsonData: JSON.stringify({
                materials: materials.map((m: any) => ({
                    part_id: m.part_id,
                    part_name: m.part_name,
                    type: m.part_type,
                    models: m.used_in_models,
                    status: getStockStatus(m.part_id),
                    stock: stockLevels.find((s: any) => s.part_id === m.part_id)?.quantity_available || 0,
                    location: stockLevels.find((s: any) => s.part_id === m.part_id)?.location || 'N/A',
                    min_stock: dispatchParams.find((d: any) => d.part_id === m.part_id)?.min_stock_level || 0,
                })),
                material_orders: materialOrders.slice(0, 20).map((o: any) => ({
                    order_id: o.order_id,
                    part_id: o.part_id,
                    supplier: o.supplier_id,
                    qty: o.quantity,
                    status: o.status,
                    expected: o.expected_delivery,
                })),
                sales_orders: salesOrders.slice(0, 20).map((o: any) => ({
                    order_id: o.order_id,
                    type: o.order_type,
                    model: o.scooter_model,
                    qty: o.quantity,
                    status: o.status,
                })),
                suppliers: suppliers.map((s: any) => ({
                    id: s.supplier_id,
                    name: s.supplier_name,
                    part: s.part_id,
                    lead_time: s.lead_time_days,
                    reliability: s.reliability_score || s.reliability_rating,
                    email: s.email || '',
                    phone: s.phone || '',
                })),
            }, null, 2),
        };
    };

    // Detect action requests from user input
    const detectAction = (text: string): ActionRequest | null => {
        const lower = text.toLowerCase();

        // Update stock pattern
        const stockMatch = lower.match(/update\s+stock\s+(?:for\s+)?(\w+)\s+to\s+(\d+)/i);
        if (stockMatch) {
            return {
                type: 'update_stock',
                collection: 'stock_levels',
                searchField: 'part_id',
                searchValue: stockMatch[1].toUpperCase(),
                data: { quantity_available: parseInt(stockMatch[2]) },
                description: `Update stock for ${stockMatch[1].toUpperCase()} to ${stockMatch[2]} units`,
            };
        }

        // Mark delivered pattern
        const deliverMatch = lower.match(/mark\s+(?:order\s+)?(\S+)\s+(?:as\s+)?delivered/i);
        if (deliverMatch) {
            return {
                type: 'mark_delivered',
                collection: 'material_orders',
                searchValue: deliverMatch[1].toUpperCase(),
                description: `Mark order ${deliverMatch[1].toUpperCase()} as delivered`,
            };
        }

        // Complex add material pattern - handles "add P513, S2_V3 Tank, assembly, stock 86, min 24, warehouse 3"
        // Also handles "add material P999 Motor Assembly" or "create part P999 called Motor"
        if (lower.includes('add') || lower.includes('create')) {
            // Extract part ID (P followed by numbers)
            const partIdMatch = text.match(/\b([Pp]\d+)\b/);
            if (partIdMatch) {
                const partId = partIdMatch[1].toUpperCase();

                // Extract part name - text after part ID, before comma or keywords
                const afterId = text.substring(text.indexOf(partIdMatch[0]) + partIdMatch[0].length);
                const nameMatch = afterId.match(/[,\s]*([^,]+?)(?:,\s*(?:assembly|component|service|stock|min|warehouse|wh\d|needed)|$)/i);
                const partName = nameMatch?.[1]?.trim() || `New Part ${partId}`;

                // Extract type
                let partType = 'component';
                if (lower.includes('assembly')) partType = 'assembly';
                else if (lower.includes('service')) partType = 'service';

                // Extract stock quantity
                const stockMatch = text.match(/stock\s*(?:now\s*)?(?:is\s*)?(\d+)/i);
                const stock = stockMatch ? parseInt(stockMatch[1]) : 100;

                // Extract min stock
                const minMatch = text.match(/(?:min|needed|minimum)\s*(?:is\s*)?(\d+)/i);
                const minStock = minMatch ? parseInt(minMatch[1]) : 50;

                // Extract warehouse/location - handles "warehouse 3" or "ware house 3" or "wh3"
                const whMatch = text.match(/(?:ware\s*house|wh)\s*(\d+)/i);
                const location = whMatch ? `WH${whMatch[1]}` : 'WH1';

                return {
                    type: 'add',
                    collection: 'materials',
                    data: {
                        part_id: partId,
                        part_name: partName,
                        part_type: partType,
                        used_in_models: [],
                        weight: 0,
                        blocked_parts: '',
                        successor_parts: '',
                        comment: 'Created via Hugo AI',
                        // Additional info for stock_levels and dispatch_parameters
                        _stock: stock,
                        _min_stock: minStock,
                        _location: location,
                    },
                    description: `Create material: ${partId} - "${partName}" (${partType}, stock: ${stock}, min: ${minStock}, location: ${location})`,
                };
            }
        }

        // Delete pattern
        const deleteMatch = lower.match(/delete\s+(?:material\s+)?(\w+)/i);
        if (deleteMatch && !lower.includes('how')) {
            return {
                type: 'delete',
                collection: 'materials',
                searchField: 'part_id',
                searchValue: deleteMatch[1].toUpperCase(),
                description: `Delete material ${deleteMatch[1].toUpperCase()}`,
            };
        }

        return null;
    };

    // Execute action
    const executeAction = async (action: ActionRequest) => {
        setIsLoading(true);
        try {
            let response;
            let result;

            // Handle email action separately
            if (action.type === 'send_email') {
                response = await fetch('/api/hugo/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(action.data),
                });
            } else {
                response = await fetch('/api/hugo/actions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: action.type,
                        collection: action.collection,
                        data: action.data,
                        searchField: action.searchField,
                        searchValue: action.searchValue,
                    }),
                });
            }

            result = await response.json();

            const resultMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: result.success
                    ? action.type === 'send_email'
                        ? `📧 **Email Sent!**\n\n${result.message}\n\nThe supplier has been notified.`
                        : `✅ **Action Completed!**\n\n${result.message}\n\nThe data has been updated in real-time.`
                    : `❌ **Action Failed**\n\n${result.error}`,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, resultMessage]);
            setPendingAction(null);
        } catch (error: any) {
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `❌ **Error:** ${error.message}`,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (messageText?: string) => {
        const text = messageText || input;
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/hugo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text.trim(),
                    databaseContext: getDatabaseContext(),
                    conversationHistory: messages.slice(1).map(m => ({ role: m.role, content: m.content })),
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Check if AI returned an action to execute
            if (data.action) {
                const action: ActionRequest = {
                    type: data.action.type,
                    collection: data.action.collection,
                    data: data.action.data,
                    searchField: data.action.searchField,
                    searchValue: data.action.searchValue,
                    description: data.action.description || 'Execute database action',
                };

                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.response + `\n\n🔧 **Action Ready:** ${action.description}`,
                    timestamp: new Date(),
                    action: action,
                };

                setMessages(prev => [...prev, assistantMessage]);
                setPendingAction(action);
            } else {
                // Regular response without action
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, assistantMessage]);
            }
        } catch (error: any) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Format message content with markdown-like styling
    const formatContent = (content: string) => {
        return content
            .split('\n')
            .map((line, i) => {
                // Bold
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                // Bullet points
                if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                    return `<li key="${i}" class="ml-4">${line.replace(/^[•\-\*]\s*/, '')}</li>`;
                }
                // Headers
                if (line.startsWith('###')) {
                    return `<h4 key="${i}" class="font-semibold mt-2">${line.replace('### ', '')}</h4>`;
                }
                if (line.startsWith('##')) {
                    return `<h3 key="${i}" class="font-bold mt-3">${line.replace('## ', '')}</h3>`;
                }
                return line ? `<p key="${i}">${line}</p>` : '<br/>';
            })
            .join('');
    };

    return (
        <>
            <Header title="Hugo AI Copilot" />
            <div className="p-8 max-w-[1200px] w-full mx-auto space-y-4 h-[calc(100vh-4rem)] flex flex-col">
                {/* Status Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                            <span className="material-symbols-outlined text-2xl text-indigo-600 dark:text-indigo-400">smart_toy</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Hugo AI
                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded flex items-center gap-1">
                                    <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Connected
                                </span>
                            </h2>
                            <p className="text-xs text-slate-500">
                                {materials.length} materials • {materialOrders.length} orders • LangChain + Groq (Llama 3.3 70B)
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearChat}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Clear chat history"
                        >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                            Clear
                        </button>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="material-symbols-outlined text-[16px]">database</span>
                            Firebase + Actions
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white dark:bg-[#262626] rounded-xl border border-gray-200 dark:border-[#404040] shadow-sm flex flex-col overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div
                                    className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant'
                                        ? 'bg-indigo-100 dark:bg-indigo-900/30'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`material-symbols-outlined text-[18px] ${msg.role === 'assistant'
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-600 dark:text-slate-300'
                                            }`}
                                    >
                                        {msg.role === 'assistant' ? 'smart_toy' : 'person'}
                                    </span>
                                </div>
                                <div className={`max-w-[75%] ${msg.role === 'user' ? '' : ''}`}>
                                    <div
                                        className={`rounded-lg p-3 ${msg.role === 'assistant'
                                            ? 'bg-slate-50 dark:bg-slate-800/50'
                                            : 'bg-indigo-600 text-white'
                                            }`}
                                    >
                                        <div
                                            className={`text-sm ${msg.role === 'assistant' ? 'text-slate-700 dark:text-slate-200' : ''
                                                } prose prose-sm max-w-none`}
                                            dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                                        />
                                        <p className={`text-xs mt-1 ${msg.role === 'assistant' ? 'text-slate-400' : 'text-indigo-200'}`}>
                                            {msg.timestamp.toLocaleTimeString()}
                                        </p>
                                    </div>
                                    {/* Action Buttons */}
                                    {msg.action && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => executeAction(msg.action!)}
                                                disabled={isLoading}
                                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">check</span>
                                                Yes, proceed
                                            </button>
                                            <button
                                                onClick={() => setPendingAction(null)}
                                                disabled={isLoading}
                                                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="size-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[18px] animate-pulse">
                                        smart_toy
                                    </span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="size-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="size-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="size-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                        </div>
                                        <span className="text-sm text-slate-500">Hugo is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 dark:border-[#404040]">
                        {/* Quick Prompts */}
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                            {samplePrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSend(prompt)}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs whitespace-nowrap hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                        {/* Input */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Hugo anything or request an action..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-[#404040] rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={isLoading || !input.trim()}
                                className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-[20px]">send</span>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
