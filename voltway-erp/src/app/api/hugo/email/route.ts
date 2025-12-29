// Hugo Email API - Send reorder emails to suppliers via Resend

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    try {
        const {
            supplierEmail,
            supplierName,
            partId,
            partName,
            currentStock,
            minStock,
            reorderQuantity,
            notes,
        } = await request.json();

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Resend API key not configured. Add RESEND_API_KEY to .env.local' },
                { status: 500 }
            );
        }

        if (!supplierEmail) {
            return NextResponse.json(
                { error: 'Supplier email is required' },
                { status: 400 }
            );
        }

        const resend = new Resend(apiKey);

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .order-box { background: white; border: 2px solid #4F46E5; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .label { color: #6B7280; font-size: 12px; text-transform: uppercase; }
    .value { font-size: 18px; font-weight: bold; color: #111827; }
    .urgent { background: #FEF2F2; border-color: #EF4444; }
    .urgent .value { color: #DC2626; }
    .footer { background: #374151; color: white; padding: 16px; border-radius: 0 0 8px 8px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">⚡ Voltway ERP - Reorder Request</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">Automated procurement notification</p>
    </div>
    <div class="content">
      <p>Dear <strong>${supplierName || 'Supplier'}</strong>,</p>
      <p>We need to place a reorder for the following part. Our stock is running low and we require immediate replenishment.</p>
      
      <div class="order-box ${currentStock < minStock ? 'urgent' : ''}">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <div>
            <p class="label">Part ID</p>
            <p class="value">${partId}</p>
          </div>
          <div style="text-align: right;">
            <p class="label">Part Name</p>
            <p class="value">${partName}</p>
          </div>
        </div>
        <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 12px 0;">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p class="label">Current Stock</p>
            <p class="value">${currentStock} units</p>
          </div>
          <div>
            <p class="label">Minimum Required</p>
            <p class="value">${minStock} units</p>
          </div>
          <div style="text-align: right;">
            <p class="label">Order Quantity</p>
            <p class="value" style="color: #4F46E5;">${reorderQuantity} units</p>
          </div>
        </div>
      </div>

      ${currentStock < minStock * 0.5 ? `
      <p style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 12px; margin: 16px 0;">
        ⚠️ <strong>URGENT:</strong> Stock is critically low. Please prioritize this order.
      </p>
      ` : ''}

      ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}

      <p>Please confirm receipt of this order and provide an estimated delivery date.</p>
      
      <p>Best regards,<br><strong>Voltway Procurement Team</strong></p>
    </div>
    <div class="footer">
      <p style="margin: 0;">This is an automated email from Voltway ERP powered by Hugo AI.</p>
      <p style="margin: 8px 0 0 0;">© 2024 Voltway Electric Scooters</p>
    </div>
  </div>
</body>
</html>
    `;

        const { data, error } = await resend.emails.send({
            from: 'Voltway Procurement <onboarding@resend.dev>',
            to: [supplierEmail],
            subject: `🔧 Reorder Request: ${partId} - ${partName} (${reorderQuantity} units)`,
            html: emailHtml,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Email sent successfully to ${supplierEmail}`,
            emailId: data?.id,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('Email API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send email' },
            { status: 500 }
        );
    }
}
