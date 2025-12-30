// Email Templates for Hugo AI

export interface ReorderEmailData {
    supplierName: string;
    partId: string;
    partName: string;
    currentStock: number;
    minStock: number;
    reorderQuantity: number;
    notes?: string;
}

/**
 * Generate reorder request email HTML
 */
export function generateReorderEmailHTML(data: ReorderEmailData): string {
    const { supplierName, partId, partName, currentStock, minStock, reorderQuantity, notes } = data;
    const isUrgent = currentStock < minStock;
    const isCritical = currentStock < minStock * 0.5;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
    .header p { margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 16px; margin-bottom: 16px; }
    .order-box { background: ${isUrgent ? '#FEF2F2' : '#F9FAFB'}; border: 2px solid ${isUrgent ? '#EF4444' : '#4F46E5'}; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .order-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
    .order-item { flex: 1; }
    .order-item.right { text-align: right; }
    .label { color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .value { font-size: 20px; font-weight: 700; color: ${isUrgent ? '#DC2626' : '#111827'}; }
    .value.highlight { color: #4F46E5; }
    .divider { border: 0; border-top: 1px solid #E5E7EB; margin: 16px 0; }
    .urgent-banner { background: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .urgent-banner strong { color: #DC2626; }
    .notes { background: #F9FAFB; padding: 16px; border-radius: 8px; margin: 16px 0; }
    .footer { background: #1F2937; color: #9CA3AF; padding: 24px; text-align: center; font-size: 12px; }
    .footer p { margin: 4px 0; }
    .cta { display: inline-block; background: #4F46E5; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ Voltway ERP</h1>
      <p>Reorder Request - Automated Procurement</p>
    </div>
    
    <div class="content">
      <p class="greeting">Dear <strong>${supplierName || 'Valued Supplier'}</strong>,</p>
      
      <p>We need to place a reorder for the following part. Our stock is running low and requires immediate replenishment.</p>
      
      <div class="order-box">
        <div class="order-row">
          <div class="order-item">
            <p class="label">Part ID</p>
            <p class="value">${partId}</p>
          </div>
          <div class="order-item right">
            <p class="label">Part Name</p>
            <p class="value">${partName}</p>
          </div>
        </div>
        
        <hr class="divider">
        
        <div class="order-row">
          <div class="order-item">
            <p class="label">Current Stock</p>
            <p class="value">${currentStock} units</p>
          </div>
          <div class="order-item">
            <p class="label">Min Required</p>
            <p class="value">${minStock} units</p>
          </div>
          <div class="order-item right">
            <p class="label">Order Quantity</p>
            <p class="value highlight">${reorderQuantity} units</p>
          </div>
        </div>
      </div>

      ${isCritical ? `
      <div class="urgent-banner">
        ⚠️ <strong>URGENT:</strong> Stock is critically low (below 50% of minimum). Please prioritize this order for immediate dispatch.
      </div>
      ` : ''}

      ${notes ? `
      <div class="notes">
        <strong>Additional Notes:</strong><br>
        ${notes}
      </div>
      ` : ''}

      <p>Please confirm receipt of this order and provide an estimated delivery date at your earliest convenience.</p>
      
      <p>Best regards,<br><strong>Voltway Procurement Team</strong></p>
    </div>
    
    <div class="footer">
      <p>This is an automated email from Voltway ERP powered by Hugo AI</p>
      <p>© ${new Date().getFullYear()} Voltway Electric Scooters</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of reorder email
 */
export function generateReorderEmailText(data: ReorderEmailData): string {
    const { supplierName, partId, partName, currentStock, minStock, reorderQuantity, notes } = data;
    const isCritical = currentStock < minStock * 0.5;

    return `
VOLTWAY ERP - Reorder Request

Dear ${supplierName || 'Valued Supplier'},

We need to place a reorder for the following part:

Part ID: ${partId}
Part Name: ${partName}
Current Stock: ${currentStock} units
Minimum Required: ${minStock} units
Order Quantity: ${reorderQuantity} units

${isCritical ? '⚠️ URGENT: Stock is critically low. Please prioritize this order.\n' : ''}
${notes ? `Additional Notes: ${notes}\n` : ''}
Please confirm receipt and provide an estimated delivery date.

Best regards,
Voltway Procurement Team

---
Automated email from Voltway ERP powered by Hugo AI
© ${new Date().getFullYear()} Voltway Electric Scooters
  `.trim();
}

/**
 * Generate email subject line
 */
export function generateReorderSubject(data: ReorderEmailData): string {
    const { partId, partName, reorderQuantity, currentStock, minStock } = data;
    const urgency = currentStock < minStock * 0.5 ? '🚨 URGENT: ' : '🔧 ';
    return `${urgency}Reorder Request: ${partId} - ${partName} (${reorderQuantity} units)`;
}
