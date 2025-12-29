'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { useMaterials, useStockLevels, useDispatchParameters, useMaterialOrders, useSalesOrders, useSuppliers } from '@/lib/useFirestore';
import jsPDF from 'jspdf';

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
    const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string; type: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        setUploadedFile(null);
    };

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024; // 5MB limit
        if (file.size > maxSize) {
            alert('File too large. Maximum size is 5MB.');
            return;
        }

        try {
            if (file.type === 'application/pdf') {
                // Read PDF as base64 for server-side processing
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64 = (reader.result as string).split(',')[1];
                    setUploadedFile({ name: file.name, content: base64, type: 'pdf' });
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith('image/')) {
                // Read image as base64
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    setUploadedFile({ name: file.name, content: base64, type: 'image' });
                };
                reader.readAsDataURL(file);
            } else {
                alert('Unsupported file type. Please upload PDF or image files.');
            }
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Failed to read file.');
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Export conversation to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - 2 * margin;
        let yPosition = 20;
        const lineHeight = 7;

        // Title
        doc.setFontSize(20);
        doc.setTextColor(79, 70, 229); // Indigo
        doc.text('Hugo AI - Conversation Report', margin, yPosition);
        yPosition += 12;

        // Subtitle with date
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // Slate
        doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
        doc.text(`Voltway ERP - Operations Hub`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 10;

        // Divider line
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Messages
        doc.setFontSize(11);
        messages.forEach((msg) => {
            // Check if we need a new page
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            // Role label
            doc.setFontSize(9);
            if (msg.role === 'user') {
                doc.setTextColor(14, 165, 233); // Cyan
                doc.text('You', margin, yPosition);
            } else {
                doc.setTextColor(99, 102, 241); // Indigo
                doc.text('Hugo AI', margin, yPosition);
            }
            yPosition += 5;

            // Message content - clean markdown
            doc.setFontSize(10);
            doc.setTextColor(15, 23, 42); // Slate-900
            const cleanContent = msg.content
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/• /g, '- ');

            const lines = doc.splitTextToSize(cleanContent, maxWidth);
            lines.forEach((line: string) => {
                if (yPosition > 280) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, margin, yPosition);
                yPosition += lineHeight;
            });
            yPosition += 5;
        });

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text(
                `Page ${i} of ${pageCount} | Voltway ERP - Hugo AI`,
                pageWidth / 2,
                290,
                { align: 'center' }
            );
        }

        doc.save(`hugo-conversation-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    // Export single message to PDF
    const exportSingleMessageToPDF = (msg: Message) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - 2 * margin;
        let yPosition = 20;
        const lineHeight = 7;

        // Header with gradient-like effect
        doc.setFillColor(79, 70, 229);
        doc.roundedRect(margin, 15, pageWidth - 2 * margin, 35, 3, 3, 'F');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text('Hugo AI', margin + 10, 32);
        doc.setFontSize(11);
        doc.setTextColor(200, 200, 255);
        doc.text('Procurement Intelligence Report', margin + 10, 42);
        yPosition = 65;

        // Subtitle
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
        doc.text(`Voltway ERP`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 8;

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 12;

        // Label
        doc.setFontSize(9);
        doc.setTextColor(99, 102, 241);
        doc.text('AI Analysis', margin, yPosition);
        yPosition += 6;

        // Content - parse line by line for structure
        const contentLines = msg.content.split('\n');
        contentLines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) { yPosition += 4; return; }

            if (yPosition > 275) { doc.addPage(); yPosition = 25; }

            // Headers (bold text or ending with colon)
            if ((trimmed.startsWith('**') && trimmed.endsWith('**')) || trimmed.endsWith(':')) {
                yPosition += 3;
                doc.setFontSize(11);
                doc.setTextColor(79, 70, 229);
                const headerText = trimmed.replace(/\*\*/g, '').replace(/:$/, '');
                doc.text(headerText, margin, yPosition);
                doc.setDrawColor(79, 70, 229);
                doc.setLineWidth(0.3);
                doc.line(margin, yPosition + 2, margin + doc.getTextWidth(headerText), yPosition + 2);
                yPosition += 9;
                return;
            }

            // Bullet points
            if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                const bulletText = trimmed.replace(/^[•\-\*]\s*/, '').replace(/\*\*/g, '');
                doc.setFontSize(10);
                doc.setTextColor(15, 23, 42);
                doc.setFillColor(14, 165, 233);
                doc.circle(margin + 2, yPosition - 1.5, 1.2, 'F');
                const wrapped = doc.splitTextToSize(bulletText, maxWidth - 10);
                wrapped.forEach((w: string) => {
                    if (yPosition > 280) { doc.addPage(); yPosition = 25; }
                    doc.text(w, margin + 8, yPosition);
                    yPosition += 5.5;
                });
                return;
            }

            // Numbered items
            const numMatch = trimmed.match(/^(\d+)\.\s*(.+)/);
            if (numMatch) {
                doc.setFillColor(79, 70, 229);
                doc.circle(margin + 3, yPosition - 1, 3, 'F');
                doc.setFontSize(7);
                doc.setTextColor(255, 255, 255);
                doc.text(numMatch[1], margin + 3, yPosition + 0.3, { align: 'center' });
                doc.setFontSize(10);
                doc.setTextColor(15, 23, 42);
                const wrapped = doc.splitTextToSize(numMatch[2].replace(/\*\*/g, ''), maxWidth - 12);
                wrapped.forEach((w: string) => {
                    if (yPosition > 280) { doc.addPage(); yPosition = 25; }
                    doc.text(w, margin + 10, yPosition);
                    yPosition += 5.5;
                });
                yPosition += 2;
                return;
            }

            // Regular text
            doc.setFontSize(10);
            doc.setTextColor(51, 65, 85);
            const wrapped = doc.splitTextToSize(trimmed.replace(/\*\*/g, ''), maxWidth);
            wrapped.forEach((w: string) => {
                if (yPosition > 280) { doc.addPage(); yPosition = 25; }
                doc.text(w, margin, yPosition);
                yPosition += 5.5;
            });
        });

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text(
                `Page ${i} of ${pageCount} | Voltway ERP - Hugo AI`,
                pageWidth / 2,
                290,
                { align: 'center' }
            );
        }

        doc.save(`hugo-report-${new Date().toISOString().split('T')[0]}.pdf`);
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
        if ((!text.trim() && !uploadedFile) || isLoading) return;

        const displayText = uploadedFile
            ? `${text.trim() || 'Analyze this document'} [📎 ${uploadedFile.name}]`
            : text.trim();

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: displayText,
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
                    message: text.trim() || 'Please analyze this document and provide key insights.',
                    databaseContext: getDatabaseContext(),
                    conversationHistory: messages.slice(1).map(m => ({ role: m.role, content: m.content })),
                    file: uploadedFile ? {
                        name: uploadedFile.name,
                        content: uploadedFile.content,
                        type: uploadedFile.type,
                    } : undefined,
                }),
            });

            // Clear uploaded file after sending
            setUploadedFile(null);

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
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <span className="material-symbols-outlined text-2xl text-white">smart_toy</span>
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
                                {materials.length} materials • {materialOrders.length} orders • MegaLLM (OpenAI OSS 120B)
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg transition-all shadow-sm hover:shadow-md"
                            title="Export conversation to PDF"
                        >
                            <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                            Export PDF
                        </button>
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
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
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
                                        <div className="flex items-center justify-between mt-1">
                                            <p className={`text-xs ${msg.role === 'assistant' ? 'text-slate-400' : 'text-indigo-200'}`}>
                                                {msg.timestamp.toLocaleTimeString()}
                                            </p>
                                            {msg.role === 'assistant' && msg.id !== '1' && (
                                                <button
                                                    onClick={() => exportSingleMessageToPDF(msg)}
                                                    className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors"
                                                    title="Export this response as PDF"
                                                >
                                                    <span className="material-symbols-outlined text-[12px]">picture_as_pdf</span>
                                                    PDF
                                                </button>
                                            )}
                                        </div>
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
                        <div className="flex flex-col gap-2">
                            {/* File upload indicator */}
                            {uploadedFile && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                                    <span className="material-symbols-outlined text-cyan-600 text-[18px]">
                                        {uploadedFile.type === 'pdf' ? 'description' : 'image'}
                                    </span>
                                    <span className="text-sm text-cyan-700 dark:text-cyan-300 flex-1 truncate">{uploadedFile.name}</span>
                                    <button
                                        onClick={() => setUploadedFile(null)}
                                        className="text-cyan-500 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </div>
                            )}
                            <div className="flex gap-2">
                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                {/* Upload button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    className="px-3 py-3 bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-[#404040] rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors disabled:opacity-50"
                                    title="Upload PDF or Image"
                                >
                                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                </button>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={uploadedFile ? `Ask about ${uploadedFile.name}...` : "Ask Hugo anything or request an action..."}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-[#404040] rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={isLoading || (!input.trim() && !uploadedFile)}
                                    className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="material-symbols-outlined text-[20px]">send</span>
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
