// Firebase Seeder Script
// Run this script to seed Firestore with sample data
// Usage: npx ts-node --esm scripts/seed-firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

// Your Firebase config - replace with actual values
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample Data (from data.ts)
const materials = [
    { part_id: 'P300', part_name: 'S1 V1 500W Brushless Motor', part_type: 'assembly', used_in_models: ['S1_V1'], weight: 3.79, blocked_parts: '', successor_parts: 'P304', comment: 'Obsolete V1 motor superseded by V2' },
    { part_id: 'P301', part_name: 'S1 V1 Li-Ion 36V 10Ah Battery Pack', part_type: 'assembly', used_in_models: ['S1_V1'], weight: 4.84, blocked_parts: '', successor_parts: 'P305', comment: 'Li-Po battery replaces Li-Ion' },
    { part_id: 'P304', part_name: 'S1 V2 750W Brushless Motor', part_type: 'assembly', used_in_models: ['S1_V2'], weight: 3.31, blocked_parts: 'P300', successor_parts: '', comment: 'Current V2 motor' },
    { part_id: 'P305', part_name: 'S1 V2 Li-Po 48V 12Ah Battery Pack', part_type: 'assembly', used_in_models: ['S1_V2'], weight: 3.16, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P312', part_name: 'S2 V2 750W Brushless Motor', part_type: 'assembly', used_in_models: ['S2_V2'], weight: 2.5, blocked_parts: 'Blocked', successor_parts: '', comment: 'Quality issues' },
    { part_id: 'P313', part_name: 'S2 V2 Li-Po 48V 12Ah Battery Pack', part_type: 'assembly', used_in_models: ['S2_V2'], weight: 2.44, blocked_parts: 'Blocked', successor_parts: '', comment: 'Safety recall' },
    { part_id: 'P320', part_name: 'S3 V2 750W Brushless Motor', part_type: 'assembly', used_in_models: ['S3_V2'], weight: 3.61, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P324', part_name: 'LCD Dashboard Display', part_type: 'assembly', used_in_models: ['S1_V1', 'S2_V1', 'S3_V1'], weight: 4.8, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P329', part_name: 'OLED Dashboard Display', part_type: 'assembly', used_in_models: ['S1_V2', 'S2_V2', 'S3_V2'], weight: 4.93, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P335', part_name: 'Comfort Seat', part_type: 'service', used_in_models: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], weight: 0.82, blocked_parts: '', successor_parts: '', comment: '' },
];

const stockLevels = [
    { part_id: 'P300', part_name: 'S1 V1 500W Brushless Motor', location: 'WH1', quantity_available: 158 },
    { part_id: 'P304', part_name: 'S1 V2 750W Brushless Motor', location: 'WH3', quantity_available: 108 },
    { part_id: 'P305', part_name: 'S1 V2 Li-Po 48V 12Ah Battery Pack', location: 'WH3', quantity_available: 24 },
    { part_id: 'P312', part_name: 'S2 V2 750W Brushless Motor', location: 'WH3', quantity_available: 144 },
    { part_id: 'P320', part_name: 'S3 V2 750W Brushless Motor', location: 'WH2', quantity_available: 159 },
    { part_id: 'P324', part_name: 'LCD Dashboard Display', location: 'WH1', quantity_available: 44 },
    { part_id: 'P329', part_name: 'OLED Dashboard Display', location: 'WH3', quantity_available: 54 },
    { part_id: 'P335', part_name: 'Comfort Seat', location: 'WH1', quantity_available: 283 },
];

const dispatchParameters = [
    { part_id: 'P300', min_stock_level: 63, reorder_quantity: 79, reorder_interval_days: 18 },
    { part_id: 'P304', min_stock_level: 45, reorder_quantity: 119, reorder_interval_days: 14 },
    { part_id: 'P305', min_stock_level: 75, reorder_quantity: 62, reorder_interval_days: 7 },
    { part_id: 'P312', min_stock_level: 50, reorder_quantity: 77, reorder_interval_days: 16 },
    { part_id: 'P320', min_stock_level: 67, reorder_quantity: 88, reorder_interval_days: 10 },
    { part_id: 'P324', min_stock_level: 25, reorder_quantity: 183, reorder_interval_days: 11 },
    { part_id: 'P329', min_stock_level: 74, reorder_quantity: 126, reorder_interval_days: 16 },
    { part_id: 'P335', min_stock_level: 60, reorder_quantity: 66, reorder_interval_days: 10 },
];

const materialOrders = [
    { order_id: 'O5000', part_id: 'P312', quantity_ordered: 32, order_date: '2025-04-19', expected_delivery_date: '2025-05-13', supplier_id: 'SupA', status: 'ordered' },
    { order_id: 'O5001', part_id: 'P314', quantity_ordered: 76, order_date: '2025-03-24', expected_delivery_date: '2025-03-29', supplier_id: 'SupA', status: 'delivered', actual_delivered_at: '2025-03-30' },
    { order_id: 'O5002', part_id: 'P318', quantity_ordered: 94, order_date: '2025-02-04', expected_delivery_date: '2025-02-14', supplier_id: 'SupA', status: 'delivered', actual_delivered_at: '2025-02-15' },
    { order_id: 'O5016', part_id: 'P307', quantity_ordered: 253, order_date: '2025-04-17', expected_delivery_date: '2025-05-05', supplier_id: 'SupC', status: 'ordered' },
    { order_id: 'O5017', part_id: 'P332', quantity_ordered: 102, order_date: '2025-04-04', expected_delivery_date: '2025-04-26', supplier_id: 'SupA', status: 'ordered' },
];

const salesOrders = [
    { sales_order_id: 'S6000', model: 'S2', version: 'V1', quantity: 10, order_type: 'webshop', requested_date: '2025-03-03', created_at: '2025-01-01', accepted_request_date: '2025-01-02' },
    { sales_order_id: 'S6001', model: 'S1', version: 'V1', quantity: 42, order_type: 'webshop', requested_date: '2025-03-31', created_at: '2025-01-03', accepted_request_date: '2025-01-04' },
    { sales_order_id: 'S6004', model: 'S3', version: 'V2', quantity: 28, order_type: 'fleet_framework', requested_date: '2025-04-03', created_at: '2025-01-09', accepted_request_date: '2025-01-10' },
    { sales_order_id: 'S6011', model: 'S2', version: 'V2', quantity: 9, order_type: 'fleet_spot', requested_date: '2025-04-04', created_at: '2025-01-23', accepted_request_date: '2025-01-24' },
];

const suppliers = [
    { supplier_id: 'SupA', part_id: 'P304', price_per_unit: 140.08, lead_time_days: 7, min_order_qty: 63, reliability_rating: 0.87 },
    { supplier_id: 'SupA', part_id: 'P305', price_per_unit: 116.6, lead_time_days: 9, min_order_qty: 84, reliability_rating: 0.73 },
    { supplier_id: 'SupB', part_id: 'P305', price_per_unit: 68.83, lead_time_days: 17, min_order_qty: 19, reliability_rating: 0.92 },
    { supplier_id: 'SupC', part_id: 'P305', price_per_unit: 35.98, lead_time_days: 15, min_order_qty: 30, reliability_rating: 0.70 },
    { supplier_id: 'SupB', part_id: 'P306', price_per_unit: 152.21, lead_time_days: 15, min_order_qty: 44, reliability_rating: 0.93 },
];

const events = [
    { event_type: 'delay', severity: 'critical', title: 'Supplier Delay - SupB', description: 'Order O5034 delayed by 5 days', affected_orders: ['O5034'], affected_materials: ['P320'], created_at: new Date().toISOString(), requires_action: true },
    { event_type: 'quality_alert', severity: 'warning', title: 'Quality Issue - P312', description: 'Batch quality inspection failed', affected_orders: [], affected_materials: ['P312'], created_at: new Date().toISOString(), requires_action: true },
    { event_type: 'price_change', severity: 'info', title: 'Price Update - SupA', description: 'New pricing for P307 effective next month', affected_orders: [], affected_materials: ['P307'], created_at: new Date().toISOString(), requires_action: false },
];

async function clearCollection(collectionName: string) {
    const snapshot = await getDocs(collection(db, collectionName));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Cleared ${collectionName}`);
}

async function seedCollection(collectionName: string, data: any[]) {
    const collectionRef = collection(db, collectionName);
    for (const item of data) {
        await addDoc(collectionRef, item);
    }
    console.log(`Seeded ${collectionName} with ${data.length} documents`);
}

async function seed() {
    console.log('Starting Firebase seed...');

    // Clear existing data
    await clearCollection('materials');
    await clearCollection('stock_levels');
    await clearCollection('dispatch_parameters');
    await clearCollection('material_orders');
    await clearCollection('sales_orders');
    await clearCollection('suppliers');
    await clearCollection('events');

    // Seed new data
    await seedCollection('materials', materials);
    await seedCollection('stock_levels', stockLevels);
    await seedCollection('dispatch_parameters', dispatchParameters);
    await seedCollection('material_orders', materialOrders);
    await seedCollection('sales_orders', salesOrders);
    await seedCollection('suppliers', suppliers);
    await seedCollection('events', events);

    console.log('Firebase seed complete!');
    process.exit(0);
}

seed().catch(console.error);
