// Hugo Email API - Send reorder emails to suppliers via Nodemailer

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import {
  generateReorderEmailHTML,
  generateReorderEmailText,
  generateReorderSubject,
  type ReorderEmailData
} from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { supplierEmail, partId, partName } = body;

    if (!supplierEmail) {
      return NextResponse.json(
        { error: 'Supplier email is required' },
        { status: 400 }
      );
    }

    if (!partId || !partName) {
      return NextResponse.json(
        { error: 'Part ID and Part Name are required' },
        { status: 400 }
      );
    }

    // Build email data with defaults
    const emailData: ReorderEmailData = {
      supplierName: body.supplierName || 'Valued Supplier',
      partId: body.partId,
      partName: body.partName,
      currentStock: body.currentStock || 0,
      minStock: body.minStock || 50,
      reorderQuantity: body.reorderQuantity || 100,
      notes: body.notes,
    };

    // Generate email content
    const subject = generateReorderSubject(emailData);
    const html = generateReorderEmailHTML(emailData);
    const text = generateReorderEmailText(emailData);

    // Send email
    const result = await sendEmail({
      to: supplierEmail,
      subject,
      html,
      text,
    });

    if (!result.success) {
      console.error('Email send failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', result.messageId);

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${supplierEmail}`,
      messageId: result.messageId,
      timestamp: new Date().toISOString(),
      details: {
        partId: emailData.partId,
        partName: emailData.partName,
        reorderQuantity: emailData.reorderQuantity,
      },
    });
  } catch (error: unknown) {
    console.error('Email API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Health check for email service
export async function GET() {
  try {
    const smtpConfigured = !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    );

    return NextResponse.json({
      service: 'Nodemailer Email Service',
      status: smtpConfigured ? 'configured' : 'not_configured',
      smtp: {
        host: process.env.SMTP_HOST ? '✓ Set' : '✗ Missing',
        port: process.env.SMTP_PORT || '587 (default)',
        user: process.env.SMTP_USER ? '✓ Set' : '✗ Missing',
        pass: process.env.SMTP_PASS ? '✓ Set' : '✗ Missing',
        from: process.env.SMTP_FROM || '(will use SMTP_USER)',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Service check failed' }, { status: 500 });
  }
}
