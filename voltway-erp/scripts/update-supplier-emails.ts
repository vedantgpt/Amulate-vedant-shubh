// Script to generate and update supplier emails
// Run: bun run scripts/update-supplier-emails.ts

import { db } from '../src/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Email domains for realistic emails
const EMAIL_DOMAINS = [
    'suppliers.com',
    'procurement.net',
    'parts-supply.com',
    'industrial-parts.co',
    'evparts.io',
    'scooter-parts.com',
    'voltway-supplier.com',
];

// Generate a realistic email based on supplier name
function generateEmail(supplierName: string, supplierId: string): string {
    // Clean supplier name for email
    const cleanName = supplierName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '.')
        .trim();

    // Pick a random domain
    const domain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];

    // Create email variations
    const variations = [
        `${cleanName}@${domain}`,
        `orders.${cleanName}@${domain}`,
        `procurement@${cleanName}.${domain.split('.')[0]}.com`,
        `${supplierId.toLowerCase()}@${domain}`,
        `sales.${cleanName}@${domain}`,
    ];

    return variations[Math.floor(Math.random() * variations.length)];
}

async function updateSupplierEmails() {
    console.log('🚀 Starting supplier email update...\n');

    try {
        const suppliersRef = collection(db, 'suppliers');
        const snapshot = await getDocs(suppliersRef);

        if (snapshot.empty) {
            console.log('❌ No suppliers found in database');
            return;
        }

        console.log(`📦 Found ${snapshot.docs.length} suppliers\n`);
        console.log('Updating emails...\n');
        console.log('─'.repeat(60));

        let updatedCount = 0;

        for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data();
            const supplierName = data.supplier_name || data.name || `Supplier ${data.supplier_id}`;
            const supplierId = data.supplier_id || docSnapshot.id;

            const newEmail = generateEmail(supplierName, supplierId);

            const docRef = doc(db, 'suppliers', docSnapshot.id);
            await updateDoc(docRef, {
                email: newEmail,
                updated_at: new Date().toISOString(),
            });

            console.log(`✓ ${supplierId.padEnd(10)} | ${supplierName.padEnd(25)} | ${newEmail}`);
            updatedCount++;
        }

        console.log('─'.repeat(60));
        console.log(`\n✅ Successfully updated ${updatedCount} supplier emails!`);

    } catch (error) {
        console.error('❌ Error updating emails:', error);
    }
}

// Run the script
updateSupplierEmails();
