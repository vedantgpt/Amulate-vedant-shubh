// Hugo AI API Route - LangChain with MegaLLM (AI-Powered Actions)

import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
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
- SEND emails to suppliers for reorders (using Resend API)

## IMPORTANT: Database & Email Actions
When the user wants to perform a database action OR send an email, you MUST respond with a JSON action block.

Format your response like this when an action is needed:
1. First explain what you will do
2. Then include the action in this EXACT format:

\`\`\`action
{
  "type": "add|update|delete|update_stock|mark_delivered|send_email",
  "collection": "materials|stock_levels|dispatch_parameters|material_orders|sales_orders|suppliers",
  "data": { ... fields to add/update ... },
  "searchField": "field_name to find document",
  "searchValue": "value to search for",
  "description": "Human readable description of action"
}
\`\`\`

## Action Examples

### Sending reorder email to supplier:
\`\`\`action
{
  "type": "send_email",
  "data": {
    "supplierEmail": "supplier@example.com",
    "supplierName": "Alpha Electronics",
    "supplierPhone": "+91 12345 67890",
    "partId": "P305",
    "partName": "S1 V2 Li-Po Battery",
    "currentStock": 25,
    "minStock": 50,
    "reorderQuantity": 100,
    "notes": "Urgent - stock critically low"
  },
  "description": "Send reorder email to Alpha Electronics for P305 battery"
}
\`\`\`

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

### Updating supplier contact info:
\`\`\`action
{
  "type": "update",
  "collection": "suppliers",
  "searchField": "supplier_id",
  "searchValue": "SupA",
  "data": { "email": "supplier@example.com", "phone": "+91 12345 67890" },
  "description": "Update SupA email and phone"
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

## Supplier Data
Suppliers have these fields: supplier_id, supplier_name, part_id, lead_time_days, reliability_score, unit_price, email, phone.
When sending emails, use the email field from the supplier data.

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
    const { message, databaseContext, conversationHistory, file } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Process uploaded file content
    let fileContext = '';
    if (file) {
      if (file.type === 'pdf') {
        try {
          // Decode base64 and extract text from PDF
          const pdfBuffer = Buffer.from(file.content, 'base64');
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const pdfParse = require('pdf-parse');
          const pdfData = await pdfParse(pdfBuffer);
          fileContext = `\n\n📄 **Uploaded Document: ${file.name}**\n\n---\n${pdfData.text.slice(0, 8000)}\n---\n`;
        } catch (err) {
          console.error('PDF parsing error:', err);
          fileContext = `\n\n📄 **Uploaded Document: ${file.name}** (PDF parsing failed - please describe the document content)\n`;
        }
      } else if (file.type === 'image') {
        fileContext = `\n\n🖼️ **Uploaded Image: ${file.name}**\n(Note: Image analysis is limited. Please describe what you see or want to know about the image.)\n`;
      }
    }

    const apiKey = process.env.MEGALLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'MegaLLM API key not configured. Add MEGALLM_API_KEY to .env.local' }, { status: 500 });
    }
    
    // Initialize LangChain with MegaLLM (OpenAI-compatible)
    const model = new ChatOpenAI({
      apiKey: apiKey,
      modelName: 'openai-gpt-oss-120b',
      temperature: 0.2,
      maxTokens: 2048,
      configuration: {
        baseURL: 'https://ai.megallm.io/v1',
      },
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
${message}${fileContext}

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
      model: 'openai-gpt-oss-120b',
      provider: 'MegaLLM + LangChain',
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
