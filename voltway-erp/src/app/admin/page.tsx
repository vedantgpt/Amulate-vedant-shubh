'use client';

import { useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/layout/Header';

// Sample data for seeding
const sampleData = {
    materials: [
        { part_id: 'P300', part_name: 'S1 V1 500W Brushless Motor', part_type: 'assembly', used_in_models: ['S1_V1'], weight: 3.79, blocked_parts: '', successor_parts: 'P304', comment: 'Obsolete V1 motor superseded by V2' },
        { part_id: 'P301', part_name: 'S1 V1 Li-Ion 36V 10Ah Battery Pack', part_type: 'assembly', used_in_models: ['S1_V1'], weight: 4.84, blocked_parts: '', successor_parts: 'P305', comment: 'Li-Po battery replaces Li-Ion' },
        { part_id: 'P304', part_name: 'S1 V2 750W Brushless Motor', part_type: 'assembly', used_in_models: ['S1_V2'], weight: 3.31, blocked_parts: 'P300', successor_parts: '', comment: 'Current V2 motor' },
        { part_id: 'P305', part_name: 'S1 V2 Li-Po 48V 12Ah Battery Pack', part_type: 'assembly', used_in_models: ['S1_V2'], weight: 3.16, blocked_parts: '', successor_parts: '', comment: '' },
        { part_id: 'P306', part_name: 'S1 V2 Digital Controller ZP', part_type: 'assembly', used_in_models: ['S1_V2'], weight: 4.15, blocked_parts: '', successor_parts: '', comment: '' },
        { part_id: 'P307', part_name: 'S1 V2 Carbon Fiber Frame', part_type: 'assembly', used_in_models: ['S1_V2'], weight: 3.99, blocked_parts: '', successor_parts: '', comment: '' },
        { part_id: 'P312', part_name: 'S2 V2 750W Brushless Motor', part_type: 'assembly', used_in_models: ['S2_V2'], weight: 2.5, blocked_parts: 'Blocked', successor_parts: '', comment: 'Quality issues' },
        { part_id: 'P313', part_name: 'S2 V2 Li-Po 48V 12Ah Battery Pack', part_type: 'assembly', used_in_models: ['S2_V2'], weight: 2.44, blocked_parts: 'Blocked', successor_parts: '', comment: 'Safety recall' },
        { part_id: 'P320', part_name: 'S3 V2 750W Brushless Motor', part_type: 'assembly', used_in_models: ['S3_V2'], weight: 3.61, blocked_parts: '', successor_parts: '', comment: '' },
        { part_id: 'P324', part_name: 'LCD Dashboard Display', part_type: 'assembly', used_in_models: ['S1_V1', 'S2_V1', 'S3_V1'], weight: 4.8, blocked_parts: '', successor_parts: '', comment: '' },
        { part_id: 'P329', part_name: 'OLED Dashboard Display', part_type: 'assembly', used_in_models: ['S1_V2', 'S2_V2', 'S3_V2'], weight: 4.93, blocked_parts: '', successor_parts: '', comment: '' },
        { part_id: 'P330', part_name: '12-inch Alloy Wheel', part_type: 'assembly', used_in_models: ['S1_V2', 'S2_V2', 'S3_V2'], weight: 3.68, blocked_parts: '', successor_parts: '', comment: '' },
        { part_id: 'P331', part_name: 'Hydraulic Disc Brake', part_type: 'assembly', used_in_models: ['S1_V2', 'S2_V2', 'S3_V2'], weight: 3.3, blocked_parts: '', successor_parts: '', comment: '' },
        { part_id: 'P335', part_name: 'Comfort Seat', part_type: 'service', used_in_models: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], weight: 0.82, blocked_parts: '', successor_parts: '', comment: '' },
    ],
    stock_levels: [
        { part_id: 'P300', part_name: 'S1 V1 500W Brushless Motor', location: 'WH1', quantity_available: 158 },
        { part_id: 'P301', part_name: 'S1 V1 Li-Ion Battery Pack', location: 'WH2', quantity_available: 173 },
        { part_id: 'P304', part_name: 'S1 V2 750W Brushless Motor', location: 'WH3', quantity_available: 108 },
        { part_id: 'P305', part_name: 'S1 V2 Li-Po 48V 12Ah Battery Pack', location: 'WH3', quantity_available: 24 },
        { part_id: 'P306', part_name: 'S1 V2 Digital Controller ZP', location: 'WH3', quantity_available: 42 },
        { part_id: 'P307', part_name: 'S1 V2 Carbon Fiber Frame', location: 'WH2', quantity_available: 32 },
        { part_id: 'P312', part_name: 'S2 V2 750W Brushless Motor', location: 'WH3', quantity_available: 144 },
        { part_id: 'P320', part_name: 'S3 V2 750W Brushless Motor', location: 'WH2', quantity_available: 159 },
        { part_id: 'P324', part_name: 'LCD Dashboard Display', location: 'WH1', quantity_available: 44 },
        { part_id: 'P329', part_name: 'OLED Dashboard Display', location: 'WH3', quantity_available: 54 },
        { part_id: 'P330', part_name: '12-inch Alloy Wheel', location: 'WH3', quantity_available: 26 },
        { part_id: 'P331', part_name: 'Hydraulic Disc Brake', location: 'WH1', quantity_available: 45 },
        { part_id: 'P335', part_name: 'Comfort Seat', location: 'WH1', quantity_available: 283 },
    ],
    dispatch_parameters: [
        { part_id: 'P300', min_stock_level: 63, reorder_quantity: 79, reorder_interval_days: 18 },
        { part_id: 'P304', min_stock_level: 45, reorder_quantity: 119, reorder_interval_days: 14 },
        { part_id: 'P305', min_stock_level: 75, reorder_quantity: 62, reorder_interval_days: 7 },
        { part_id: 'P306', min_stock_level: 25, reorder_quantity: 66, reorder_interval_days: 18 },
        { part_id: 'P307', min_stock_level: 52, reorder_quantity: 187, reorder_interval_days: 8 },
        { part_id: 'P312', min_stock_level: 50, reorder_quantity: 77, reorder_interval_days: 16 },
        { part_id: 'P320', min_stock_level: 67, reorder_quantity: 88, reorder_interval_days: 10 },
        { part_id: 'P324', min_stock_level: 25, reorder_quantity: 183, reorder_interval_days: 11 },
        { part_id: 'P329', min_stock_level: 74, reorder_quantity: 126, reorder_interval_days: 16 },
        { part_id: 'P330', min_stock_level: 44, reorder_quantity: 155, reorder_interval_days: 11 },
        { part_id: 'P331', min_stock_level: 62, reorder_quantity: 43, reorder_interval_days: 13 },
        { part_id: 'P335', min_stock_level: 60, reorder_quantity: 66, reorder_interval_days: 10 },
    ],
    material_orders: [
        { order_id: 'O5000', part_id: 'P312', quantity_ordered: 32, order_date: '2025-04-19', expected_delivery_date: '2025-05-13', supplier_id: 'SupA', status: 'ordered' },
        { order_id: 'O5001', part_id: 'P305', quantity_ordered: 76, order_date: '2025-03-24', expected_delivery_date: '2025-03-29', supplier_id: 'SupA', status: 'delivered', actual_delivered_at: '2025-03-30' },
        { order_id: 'O5002', part_id: 'P306', quantity_ordered: 94, order_date: '2025-02-04', expected_delivery_date: '2025-02-14', supplier_id: 'SupA', status: 'delivered', actual_delivered_at: '2025-02-15' },
        { order_id: 'O5016', part_id: 'P307', quantity_ordered: 253, order_date: '2025-04-17', expected_delivery_date: '2025-05-05', supplier_id: 'SupC', status: 'ordered' },
        { order_id: 'O5017', part_id: 'P329', quantity_ordered: 102, order_date: '2025-04-04', expected_delivery_date: '2025-04-26', supplier_id: 'SupA', status: 'ordered' },
        { order_id: 'O5018', part_id: 'P330', quantity_ordered: 184, order_date: '2025-04-19', expected_delivery_date: '2025-04-25', supplier_id: 'SupB', status: 'ordered' },
    ],
    sales_orders: [
        { sales_order_id: 'S6000', model: 'S2', version: 'V1', quantity: 10, order_type: 'webshop', requested_date: '2025-03-03', created_at: '2025-01-01', accepted_request_date: '2025-01-02' },
        { sales_order_id: 'S6001', model: 'S1', version: 'V1', quantity: 42, order_type: 'webshop', requested_date: '2025-03-31', created_at: '2025-01-03', accepted_request_date: '2025-01-04' },
        { sales_order_id: 'S6002', model: 'S1', version: 'V2', quantity: 13, order_type: 'webshop', requested_date: '2025-04-10', created_at: '2025-01-05', accepted_request_date: '2025-01-06' },
        { sales_order_id: 'S6003', model: 'S2', version: 'V2', quantity: 24, order_type: 'fleet_framework', requested_date: '2025-04-04', created_at: '2025-01-07', accepted_request_date: '2025-01-08' },
        { sales_order_id: 'S6004', model: 'S3', version: 'V2', quantity: 28, order_type: 'fleet_framework', requested_date: '2025-04-03', created_at: '2025-01-09', accepted_request_date: '2025-01-10' },
        { sales_order_id: 'S6005', model: 'S1', version: 'V1', quantity: 40, order_type: 'fleet_spot', requested_date: '2025-03-26', created_at: '2025-01-11', accepted_request_date: '2025-01-12' },
    ],
    suppliers: [
        { supplier_id: 'SupA', supplier_name: 'Alpha Electronics', part_id: 'P304', price_per_unit: 140.08, lead_time_days: 7, min_order_qty: 63, reliability_rating: 0.87 },
        { supplier_id: 'SupA', supplier_name: 'Alpha Electronics', part_id: 'P305', price_per_unit: 116.6, lead_time_days: 9, min_order_qty: 84, reliability_rating: 0.73 },
        { supplier_id: 'SupB', supplier_name: 'Beta Motors', part_id: 'P305', price_per_unit: 68.83, lead_time_days: 17, min_order_qty: 19, reliability_rating: 0.92 },
        { supplier_id: 'SupC', supplier_name: 'Gamma Parts', part_id: 'P305', price_per_unit: 35.98, lead_time_days: 15, min_order_qty: 30, reliability_rating: 0.70 },
        { supplier_id: 'SupB', supplier_name: 'Beta Motors', part_id: 'P306', price_per_unit: 152.21, lead_time_days: 15, min_order_qty: 44, reliability_rating: 0.93 },
        { supplier_id: 'SupC', supplier_name: 'Gamma Parts', part_id: 'P306', price_per_unit: 121.89, lead_time_days: 7, min_order_qty: 26, reliability_rating: 0.84 },
        { supplier_id: 'SupA', supplier_name: 'Alpha Electronics', part_id: 'P307', price_per_unit: 110.45, lead_time_days: 17, min_order_qty: 82, reliability_rating: 0.95 },
        { supplier_id: 'SupB', supplier_name: 'Beta Motors', part_id: 'P329', price_per_unit: 89.50, lead_time_days: 12, min_order_qty: 50, reliability_rating: 0.88 },
        { supplier_id: 'SupC', supplier_name: 'Gamma Parts', part_id: 'P330', price_per_unit: 45.00, lead_time_days: 10, min_order_qty: 100, reliability_rating: 0.82 },
    ],
};

export default function AdminPage() {
    const [status, setStatus] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const seedCollection = async (collectionName: string) => {
        setStatus(prev => ({ ...prev, [collectionName]: 'Seeding...' }));
        try {
            const data = sampleData[collectionName as keyof typeof sampleData];
            const colRef = collection(db, collectionName);

            // Clear existing data
            const existing = await getDocs(colRef);
            for (const docSnap of existing.docs) {
                await deleteDoc(doc(db, collectionName, docSnap.id));
            }

            // Add new data
            for (const item of data) {
                await addDoc(colRef, item);
            }

            setStatus(prev => ({ ...prev, [collectionName]: `✅ Seeded ${data.length} documents` }));
        } catch (error: any) {
            setStatus(prev => ({ ...prev, [collectionName]: `❌ Error: ${error.message}` }));
        }
    };

    const seedAll = async () => {
        setLoading(true);
        const collections = Object.keys(sampleData);
        for (const col of collections) {
            await seedCollection(col);
        }
        setLoading(false);
    };

    const clearCollection = async (collectionName: string) => {
        setStatus(prev => ({ ...prev, [collectionName]: 'Clearing...' }));
        try {
            const colRef = collection(db, collectionName);
            const existing = await getDocs(colRef);
            for (const docSnap of existing.docs) {
                await deleteDoc(doc(db, collectionName, docSnap.id));
            }
            setStatus(prev => ({ ...prev, [collectionName]: `🗑️ Cleared ${existing.size} documents` }));
        } catch (error: any) {
            setStatus(prev => ({ ...prev, [collectionName]: `❌ Error: ${error.message}` }));
        }
    };

    const collections = [
        { name: 'materials', label: 'Materials', icon: 'category' },
        { name: 'stock_levels', label: 'Stock Levels', icon: 'inventory_2' },
        { name: 'dispatch_parameters', label: 'Dispatch Parameters', icon: 'tune' },
        { name: 'material_orders', label: 'Purchase Orders', icon: 'shopping_cart' },
        { name: 'sales_orders', label: 'Sales Orders', icon: 'point_of_sale' },
        { name: 'suppliers', label: 'Suppliers', icon: 'local_shipping' },
    ];

    return (
        <>
            <Header title="Admin - Database Management" />
            <div className="p-8 max-w-[1200px] w-full mx-auto space-y-6">
                {/* Seed All Button */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Database Seeder</h2>
                            <p className="text-sm text-slate-500">Populate Firestore with sample ERP data</p>
                        </div>
                        <button
                            onClick={seedAll}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">database</span>
                            {loading ? 'Seeding...' : 'Seed All Collections'}
                        </button>
                    </div>

                    {/* Collection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {collections.map((col) => (
                            <div key={col.name} className="bg-slate-50 dark:bg-slate-800/50 rounded p-4 border border-gray-200 dark:border-[#404040]">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-[#595959]">{col.icon}</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{col.label}</span>
                                </div>
                                <div className="flex gap-2 mb-2">
                                    <button
                                        onClick={() => seedCollection(col.name)}
                                        className="flex-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                                    >
                                        Seed
                                    </button>
                                    <button
                                        onClick={() => clearCollection(col.name)}
                                        className="flex-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                                {status[col.name] && (
                                    <p className="text-xs text-slate-500">{status[col.name]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded p-4">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-amber-600">info</span>
                        <div>
                            <h4 className="font-medium text-amber-800 dark:text-amber-300">Firestore Rules Required</h4>
                            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                                Make sure your Firestore is in <strong>test mode</strong> or has rules allowing read/write access.
                                Go to Firebase Console → Firestore → Rules and set:
                            </p>
                            <pre className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/40 rounded text-xs overflow-x-auto">
                                {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
