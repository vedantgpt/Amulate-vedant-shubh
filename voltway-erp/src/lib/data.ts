import {
    Material,
    StockLevel,
    Supplier,
    MaterialOrder,
    SalesOrder,
    DispatchParameter,
} from '@/types';

// Sample Material Master Data
export const materials: Material[] = [
    { part_id: 'P300', part_name: 'S1 V1 500W Brushless Motor', part_type: 'assembly', used_in_models: ['S1_V1'], dimensions: 'N/A', weight: 3.79, blocked_parts: '', successor_parts: 'P304', comment: 'Obsolete V1 motor superseded by V2' },
    { part_id: 'P301', part_name: 'S1 V1 Li-Ion 36V 10Ah Battery Pack', part_type: 'assembly', used_in_models: ['S1_V1'], dimensions: 'N/A', weight: 4.84, blocked_parts: '', successor_parts: 'P305', comment: 'Li-Po battery replaces Li-Ion' },
    { part_id: 'P302', part_name: 'S1 V1 Analog Controller ZX', part_type: 'assembly', used_in_models: ['S1_V1'], dimensions: 'N/A', weight: 2.29, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P303', part_name: 'S1 V1 Aluminum Frame', part_type: 'assembly', used_in_models: ['S1_V1'], dimensions: 'N/A', weight: 4.01, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P304', part_name: 'S1 V2 750W Brushless Motor', part_type: 'assembly', used_in_models: ['S1_V2'], dimensions: 'N/A', weight: 3.31, blocked_parts: 'P300', successor_parts: '', comment: 'Current V2 motor' },
    { part_id: 'P305', part_name: 'S1 V2 Li-Po 48V 12Ah Battery Pack', part_type: 'assembly', used_in_models: ['S1_V2'], dimensions: 'N/A', weight: 3.16, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P306', part_name: 'S1 V2 Digital Controller ZP', part_type: 'assembly', used_in_models: ['S1_V2'], dimensions: 'N/A', weight: 4.15, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P307', part_name: 'S1 V2 Carbon Fiber Frame', part_type: 'assembly', used_in_models: ['S1_V2'], dimensions: 'N/A', weight: 3.99, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P308', part_name: 'S2 V1 500W Brushless Motor', part_type: 'assembly', used_in_models: ['S2_V1'], dimensions: 'N/A', weight: 4.46, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P309', part_name: 'S2 V1 Li-Ion 36V 10Ah Battery Pack', part_type: 'assembly', used_in_models: ['S2_V1'], dimensions: 'N/A', weight: 1.77, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P310', part_name: 'S2 V1 Analog Controller ZX', part_type: 'assembly', used_in_models: ['S2_V1'], dimensions: 'N/A', weight: 4.94, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P311', part_name: 'S2 V1 Aluminum Frame', part_type: 'assembly', used_in_models: ['S2_V1'], dimensions: 'N/A', weight: 0.75, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P312', part_name: 'S2 V2 750W Brushless Motor', part_type: 'assembly', used_in_models: ['S2_V2'], dimensions: 'N/A', weight: 2.5, blocked_parts: 'Blocked', successor_parts: '', comment: 'Quality issues' },
    { part_id: 'P313', part_name: 'S2 V2 Li-Po 48V 12Ah Battery Pack', part_type: 'assembly', used_in_models: ['S2_V2'], dimensions: 'N/A', weight: 2.44, blocked_parts: 'Blocked', successor_parts: '', comment: 'Safety recall' },
    { part_id: 'P314', part_name: 'S2 V2 Digital Controller ZP', part_type: 'assembly', used_in_models: ['S2_V2'], dimensions: 'N/A', weight: 1.46, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P315', part_name: 'S2 V2 Carbon Fiber Frame', part_type: 'assembly', used_in_models: ['S2_V2'], dimensions: 'N/A', weight: 0.81, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P316', part_name: 'S3 V1 500W Brushless Motor', part_type: 'assembly', used_in_models: ['S3_V1'], dimensions: 'N/A', weight: 1.09, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P317', part_name: 'S3 V1 Li-Ion 36V 10Ah Battery Pack', part_type: 'assembly', used_in_models: ['S3_V1'], dimensions: 'N/A', weight: 2.07, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P318', part_name: 'S3 V1 Analog Controller ZX', part_type: 'assembly', used_in_models: ['S3_V1'], dimensions: 'N/A', weight: 2.7, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P319', part_name: 'S3 V1 Aluminum Frame', part_type: 'assembly', used_in_models: ['S3_V1'], dimensions: 'N/A', weight: 3.97, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P320', part_name: 'S3 V2 750W Brushless Motor', part_type: 'assembly', used_in_models: ['S3_V2'], dimensions: 'N/A', weight: 3.61, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P321', part_name: 'S3 V2 Li-Po 48V 12Ah Battery Pack', part_type: 'assembly', used_in_models: ['S3_V2'], dimensions: 'N/A', weight: 4.69, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P322', part_name: 'S3 V2 Digital Controller ZP', part_type: 'assembly', used_in_models: ['S3_V2'], dimensions: 'N/A', weight: 2.98, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P323', part_name: 'S3 V2 Carbon Fiber Frame', part_type: 'assembly', used_in_models: ['S3_V2'], dimensions: 'N/A', weight: 3.55, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P324', part_name: 'LCD Dashboard Display', part_type: 'assembly', used_in_models: ['S1_V1', 'S2_V1', 'S3_V1'], dimensions: 'N/A', weight: 4.8, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P325', part_name: '10-inch Alloy Wheel', part_type: 'assembly', used_in_models: ['S1_V1', 'S2_V1', 'S3_V1'], dimensions: 'N/A', weight: 4.1, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P326', part_name: 'Mechanical Disc Brake', part_type: 'assembly', used_in_models: ['S1_V1', 'S2_V1', 'S3_V1'], dimensions: 'N/A', weight: 0.56, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P327', part_name: 'Standard LED Headlight', part_type: 'assembly', used_in_models: ['S1_V1', 'S2_V1', 'S3_V1'], dimensions: 'N/A', weight: 2.76, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P328', part_name: 'Standard Charger 42V', part_type: 'assembly', used_in_models: ['S1_V1', 'S2_V1', 'S3_V1'], dimensions: 'N/A', weight: 1.94, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P329', part_name: 'OLED Dashboard Display', part_type: 'assembly', used_in_models: ['S1_V2', 'S2_V2', 'S3_V2'], dimensions: 'N/A', weight: 4.93, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P330', part_name: '12-inch Alloy Wheel', part_type: 'assembly', used_in_models: ['S1_V2', 'S2_V2', 'S3_V2'], dimensions: 'N/A', weight: 3.68, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P331', part_name: 'Hydraulic Disc Brake', part_type: 'assembly', used_in_models: ['S1_V2', 'S2_V2', 'S3_V2'], dimensions: 'N/A', weight: 3.3, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P332', part_name: 'Advanced LED Headlight with DRL', part_type: 'assembly', used_in_models: ['S1_V2', 'S2_V2', 'S3_V2'], dimensions: 'N/A', weight: 4.38, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P333', part_name: 'Fast Charger 42V 2A', part_type: 'assembly', used_in_models: ['S1_V2', 'S2_V2', 'S3_V2'], dimensions: 'N/A', weight: 1.16, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P334', part_name: 'Power Cable', part_type: 'assembly', used_in_models: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], dimensions: 'N/A', weight: 4.03, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P335', part_name: 'Comfort Seat', part_type: 'service', used_in_models: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], dimensions: 'N/A', weight: 0.82, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P336', part_name: 'Rear Fender', part_type: 'service', used_in_models: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], dimensions: 'N/A', weight: 2.34, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P337', part_name: 'Hex Nut', part_type: 'service', used_in_models: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], dimensions: 'N/A', weight: 3.48, blocked_parts: '', successor_parts: '', comment: '' },
    { part_id: 'P338', part_name: 'Lock Washer', part_type: 'service', used_in_models: ['S1_V1', 'S1_V2', 'S2_V1', 'S2_V2', 'S3_V1', 'S3_V2'], dimensions: 'N/A', weight: 1.98, blocked_parts: '', successor_parts: '', comment: '' },
];

// Sample Stock Levels
export const stockLevels: StockLevel[] = [
    { part_id: 'P300', part_name: 'S1 V1 500W Brushless Motor', location: 'WH1', quantity_available: 158 },
    { part_id: 'P301', part_name: 'S1 V1 Li-Ion 36V 10Ah Battery Pack', location: 'WH2', quantity_available: 173 },
    { part_id: 'P302', part_name: 'S1 V1 Analog Controller ZX', location: 'WH2', quantity_available: 257 },
    { part_id: 'P303', part_name: 'S1 V1 Aluminum Frame', location: 'WH1', quantity_available: 289 },
    { part_id: 'P304', part_name: 'S1 V2 750W Brushless Motor', location: 'WH3', quantity_available: 108 },
    { part_id: 'P305', part_name: 'S1 V2 Li-Po 48V 12Ah Battery Pack', location: 'WH3', quantity_available: 24 },
    { part_id: 'P306', part_name: 'S1 V2 Digital Controller ZP', location: 'WH3', quantity_available: 42 },
    { part_id: 'P307', part_name: 'S1 V2 Carbon Fiber Frame', location: 'WH2', quantity_available: 32 },
    { part_id: 'P308', part_name: 'S2 V1 500W Brushless Motor', location: 'WH1', quantity_available: 20 },
    { part_id: 'P309', part_name: 'S2 V1 Li-Ion 36V 10Ah Battery Pack', location: 'WH2', quantity_available: 160 },
    { part_id: 'P310', part_name: 'S2 V1 Analog Controller ZX', location: 'WH2', quantity_available: 167 },
    { part_id: 'P311', part_name: 'S2 V1 Aluminum Frame', location: 'WH3', quantity_available: 107 },
    { part_id: 'P312', part_name: 'S2 V2 750W Brushless Motor', location: 'WH3', quantity_available: 144 },
    { part_id: 'P313', part_name: 'S2 V2 Li-Po 48V 12Ah Battery Pack', location: 'WH3', quantity_available: 193 },
    { part_id: 'P314', part_name: 'S2 V2 Digital Controller ZP', location: 'WH3', quantity_available: 197 },
    { part_id: 'P315', part_name: 'S2 V2 Carbon Fiber Frame', location: 'WH2', quantity_available: 83 },
    { part_id: 'P316', part_name: 'S3 V1 500W Brushless Motor', location: 'WH3', quantity_available: 57 },
    { part_id: 'P317', part_name: 'S3 V1 Li-Ion 36V 10Ah Battery Pack', location: 'WH1', quantity_available: 272 },
    { part_id: 'P318', part_name: 'S3 V1 Analog Controller ZX', location: 'WH2', quantity_available: 217 },
    { part_id: 'P319', part_name: 'S3 V1 Aluminum Frame', location: 'WH1', quantity_available: 136 },
    { part_id: 'P320', part_name: 'S3 V2 750W Brushless Motor', location: 'WH2', quantity_available: 159 },
    { part_id: 'P321', part_name: 'S3 V2 Li-Po 48V 12Ah Battery Pack', location: 'WH3', quantity_available: 139 },
    { part_id: 'P322', part_name: 'S3 V2 Digital Controller ZP', location: 'WH1', quantity_available: 176 },
    { part_id: 'P323', part_name: 'S3 V2 Carbon Fiber Frame', location: 'WH1', quantity_available: 59 },
    { part_id: 'P324', part_name: 'LCD Dashboard Display', location: 'WH1', quantity_available: 44 },
    { part_id: 'P325', part_name: '10-inch Alloy Wheel', location: 'WH2', quantity_available: 59 },
    { part_id: 'P326', part_name: 'Mechanical Disc Brake', location: 'WH1', quantity_available: 233 },
    { part_id: 'P327', part_name: 'Standard LED Headlight', location: 'WH2', quantity_available: 242 },
    { part_id: 'P328', part_name: 'Standard Charger 42V', location: 'WH3', quantity_available: 226 },
    { part_id: 'P329', part_name: 'OLED Dashboard Display', location: 'WH3', quantity_available: 54 },
    { part_id: 'P330', part_name: '12-inch Alloy Wheel', location: 'WH3', quantity_available: 26 },
    { part_id: 'P331', part_name: 'Hydraulic Disc Brake', location: 'WH1', quantity_available: 45 },
    { part_id: 'P332', part_name: 'Advanced LED Headlight with DRL', location: 'WH3', quantity_available: 20 },
    { part_id: 'P333', part_name: 'Fast Charger 42V 2A', location: 'WH2', quantity_available: 128 },
    { part_id: 'P334', part_name: 'Power Cable', location: 'WH3', quantity_available: 209 },
    { part_id: 'P335', part_name: 'Comfort Seat', location: 'WH1', quantity_available: 283 },
    { part_id: 'P336', part_name: 'Rear Fender', location: 'WH3', quantity_available: 104 },
    { part_id: 'P337', part_name: 'Hex Nut', location: 'WH1', quantity_available: 229 },
    { part_id: 'P338', part_name: 'Lock Washer', location: 'WH1', quantity_available: 31 },
];

// Dispatch Parameters
export const dispatchParameters: DispatchParameter[] = [
    { part_id: 'P300', min_stock_level: 63, reorder_quantity: 79, reorder_interval_days: 18 },
    { part_id: 'P301', min_stock_level: 39, reorder_quantity: 54, reorder_interval_days: 13 },
    { part_id: 'P302', min_stock_level: 41, reorder_quantity: 146, reorder_interval_days: 13 },
    { part_id: 'P303', min_stock_level: 79, reorder_quantity: 124, reorder_interval_days: 15 },
    { part_id: 'P304', min_stock_level: 45, reorder_quantity: 119, reorder_interval_days: 14 },
    { part_id: 'P305', min_stock_level: 75, reorder_quantity: 62, reorder_interval_days: 7 },
    { part_id: 'P306', min_stock_level: 25, reorder_quantity: 66, reorder_interval_days: 18 },
    { part_id: 'P307', min_stock_level: 52, reorder_quantity: 187, reorder_interval_days: 8 },
    { part_id: 'P308', min_stock_level: 30, reorder_quantity: 58, reorder_interval_days: 10 },
    { part_id: 'P309', min_stock_level: 49, reorder_quantity: 193, reorder_interval_days: 17 },
    { part_id: 'P310', min_stock_level: 77, reorder_quantity: 30, reorder_interval_days: 9 },
    { part_id: 'P311', min_stock_level: 37, reorder_quantity: 59, reorder_interval_days: 12 },
    { part_id: 'P312', min_stock_level: 50, reorder_quantity: 77, reorder_interval_days: 16 },
    { part_id: 'P313', min_stock_level: 72, reorder_quantity: 42, reorder_interval_days: 8 },
    { part_id: 'P314', min_stock_level: 70, reorder_quantity: 74, reorder_interval_days: 11 },
    { part_id: 'P315', min_stock_level: 79, reorder_quantity: 66, reorder_interval_days: 8 },
    { part_id: 'P316', min_stock_level: 32, reorder_quantity: 145, reorder_interval_days: 9 },
    { part_id: 'P317', min_stock_level: 55, reorder_quantity: 78, reorder_interval_days: 8 },
    { part_id: 'P318', min_stock_level: 71, reorder_quantity: 199, reorder_interval_days: 9 },
    { part_id: 'P319', min_stock_level: 74, reorder_quantity: 109, reorder_interval_days: 10 },
    { part_id: 'P320', min_stock_level: 67, reorder_quantity: 88, reorder_interval_days: 10 },
    { part_id: 'P321', min_stock_level: 18, reorder_quantity: 155, reorder_interval_days: 8 },
    { part_id: 'P322', min_stock_level: 50, reorder_quantity: 148, reorder_interval_days: 21 },
    { part_id: 'P323', min_stock_level: 71, reorder_quantity: 165, reorder_interval_days: 9 },
    { part_id: 'P324', min_stock_level: 25, reorder_quantity: 183, reorder_interval_days: 11 },
    { part_id: 'P325', min_stock_level: 56, reorder_quantity: 121, reorder_interval_days: 21 },
    { part_id: 'P326', min_stock_level: 19, reorder_quantity: 132, reorder_interval_days: 17 },
    { part_id: 'P327', min_stock_level: 56, reorder_quantity: 111, reorder_interval_days: 12 },
    { part_id: 'P328', min_stock_level: 49, reorder_quantity: 144, reorder_interval_days: 19 },
    { part_id: 'P329', min_stock_level: 74, reorder_quantity: 126, reorder_interval_days: 16 },
    { part_id: 'P330', min_stock_level: 44, reorder_quantity: 155, reorder_interval_days: 11 },
    { part_id: 'P331', min_stock_level: 62, reorder_quantity: 43, reorder_interval_days: 13 },
    { part_id: 'P332', min_stock_level: 30, reorder_quantity: 93, reorder_interval_days: 9 },
    { part_id: 'P333', min_stock_level: 64, reorder_quantity: 92, reorder_interval_days: 21 },
    { part_id: 'P334', min_stock_level: 33, reorder_quantity: 148, reorder_interval_days: 9 },
    { part_id: 'P335', min_stock_level: 60, reorder_quantity: 66, reorder_interval_days: 10 },
    { part_id: 'P336', min_stock_level: 16, reorder_quantity: 64, reorder_interval_days: 9 },
    { part_id: 'P337', min_stock_level: 20, reorder_quantity: 89, reorder_interval_days: 11 },
    { part_id: 'P338', min_stock_level: 15, reorder_quantity: 104, reorder_interval_days: 8 },
];

// Sample Material Orders (first 20)
export const materialOrders: MaterialOrder[] = [
    { order_id: 'O5000', part_id: 'P312', quantity_ordered: 32, order_date: '2025-04-19', expected_delivery_date: '2025-05-13', supplier_id: 'SupA', status: 'ordered' },
    { order_id: 'O5001', part_id: 'P314', quantity_ordered: 76, order_date: '2025-03-24', expected_delivery_date: '2025-03-29', supplier_id: 'SupA', status: 'delivered', actual_delivered_at: '2025-03-30' },
    { order_id: 'O5002', part_id: 'P318', quantity_ordered: 94, order_date: '2025-02-04', expected_delivery_date: '2025-02-14', supplier_id: 'SupA', status: 'delivered', actual_delivered_at: '2025-02-15' },
    { order_id: 'O5003', part_id: 'P329', quantity_ordered: 294, order_date: '2025-03-24', expected_delivery_date: '2025-04-07', supplier_id: 'SupA', status: 'delivered', actual_delivered_at: '2025-04-08' },
    { order_id: 'O5004', part_id: 'P306', quantity_ordered: 88, order_date: '2025-01-24', expected_delivery_date: '2025-02-08', supplier_id: 'SupB', status: 'delivered', actual_delivered_at: '2025-02-09' },
    { order_id: 'O5005', part_id: 'P323', quantity_ordered: 295, order_date: '2025-03-13', expected_delivery_date: '2025-03-25', supplier_id: 'SupB', status: 'delivered', actual_delivered_at: '2025-03-26' },
    { order_id: 'O5016', part_id: 'P307', quantity_ordered: 253, order_date: '2025-04-17', expected_delivery_date: '2025-05-05', supplier_id: 'SupC', status: 'ordered' },
    { order_id: 'O5017', part_id: 'P332', quantity_ordered: 102, order_date: '2025-04-04', expected_delivery_date: '2025-04-26', supplier_id: 'SupA', status: 'ordered' },
    { order_id: 'O5018', part_id: 'P311', quantity_ordered: 184, order_date: '2025-04-19', expected_delivery_date: '2025-04-25', supplier_id: 'SupA', status: 'ordered' },
    { order_id: 'O5023', part_id: 'P301', quantity_ordered: 98, order_date: '2025-04-18', expected_delivery_date: '2025-05-13', supplier_id: 'SupB', status: 'ordered' },
];

// Sample Sales Orders (first 20)
export const salesOrders: SalesOrder[] = [
    { sales_order_id: 'S6000', model: 'S2', version: 'V1', quantity: 10, order_type: 'webshop', requested_date: '2025-03-03', created_at: '2025-01-01', accepted_request_date: '2025-01-02' },
    { sales_order_id: 'S6001', model: 'S1', version: 'V1', quantity: 42, order_type: 'webshop', requested_date: '2025-03-31', created_at: '2025-01-03', accepted_request_date: '2025-01-04' },
    { sales_order_id: 'S6002', model: 'S1', version: 'V1', quantity: 13, order_type: 'webshop', requested_date: '2025-04-10', created_at: '2025-01-05', accepted_request_date: '2025-01-06' },
    { sales_order_id: 'S6003', model: 'S2', version: 'V2', quantity: 24, order_type: 'webshop', requested_date: '2025-04-04', created_at: '2025-01-07', accepted_request_date: '2025-01-08' },
    { sales_order_id: 'S6004', model: 'S3', version: 'V2', quantity: 28, order_type: 'fleet_framework', requested_date: '2025-04-03', created_at: '2025-01-09', accepted_request_date: '2025-01-10' },
    { sales_order_id: 'S6005', model: 'S1', version: 'V1', quantity: 40, order_type: 'fleet_framework', requested_date: '2025-03-26', created_at: '2025-01-11', accepted_request_date: '2025-01-12' },
    { sales_order_id: 'S6006', model: 'S2', version: 'V2', quantity: 15, order_type: 'fleet_framework', requested_date: '2025-03-01', created_at: '2025-01-13', accepted_request_date: '2025-01-14' },
    { sales_order_id: 'S6007', model: 'S3', version: 'V2', quantity: 17, order_type: 'webshop', requested_date: '2025-03-15', created_at: '2025-01-15', accepted_request_date: '2025-01-16' },
    { sales_order_id: 'S6008', model: 'S1', version: 'V2', quantity: 18, order_type: 'webshop', requested_date: '2025-03-03', created_at: '2025-01-17', accepted_request_date: '2025-01-18' },
    { sales_order_id: 'S6009', model: 'S2', version: 'V1', quantity: 20, order_type: 'webshop', requested_date: '2025-03-15', created_at: '2025-01-19', accepted_request_date: '2025-01-20' },
    { sales_order_id: 'S6010', model: 'S1', version: 'V1', quantity: 36, order_type: 'webshop', requested_date: '2025-03-13', created_at: '2025-01-21', accepted_request_date: '2025-01-22' },
    { sales_order_id: 'S6011', model: 'S2', version: 'V2', quantity: 9, order_type: 'fleet_spot', requested_date: '2025-04-04', created_at: '2025-01-23', accepted_request_date: '2025-01-24' },
];

// Supplier Master Data
export const suppliers: Supplier[] = [
    { supplier_id: 'SupA', part_id: 'P304', price_per_unit: 140.08, lead_time_days: 7, min_order_qty: 63, reliability_rating: 0.87 },
    { supplier_id: 'SupA', part_id: 'P305', price_per_unit: 116.6, lead_time_days: 9, min_order_qty: 84, reliability_rating: 0.73 },
    { supplier_id: 'SupB', part_id: 'P305', price_per_unit: 68.83, lead_time_days: 17, min_order_qty: 19, reliability_rating: 0.92 },
    { supplier_id: 'SupC', part_id: 'P305', price_per_unit: 35.98, lead_time_days: 15, min_order_qty: 30, reliability_rating: 0.70 },
    { supplier_id: 'SupB', part_id: 'P306', price_per_unit: 152.21, lead_time_days: 15, min_order_qty: 44, reliability_rating: 0.93 },
    { supplier_id: 'SupC', part_id: 'P306', price_per_unit: 121.89, lead_time_days: 7, min_order_qty: 26, reliability_rating: 0.84 },
    { supplier_id: 'SupA', part_id: 'P307', price_per_unit: 110.45, lead_time_days: 17, min_order_qty: 82, reliability_rating: 0.95 },
    { supplier_id: 'SupB', part_id: 'P307', price_per_unit: 189.48, lead_time_days: 14, min_order_qty: 63, reliability_rating: 0.70 },
    { supplier_id: 'SupC', part_id: 'P307', price_per_unit: 152.0, lead_time_days: 18, min_order_qty: 69, reliability_rating: 0.75 },
];

// Helper function to get stock status
export function getStockStatus(partId: string): 'healthy' | 'low' | 'critical' {
    const stock = stockLevels.find(s => s.part_id === partId);
    const dispatch = dispatchParameters.find(d => d.part_id === partId);

    if (!stock || !dispatch) return 'healthy';

    if (stock.quantity_available <= dispatch.min_stock_level * 0.5) return 'critical';
    if (stock.quantity_available <= dispatch.min_stock_level) return 'low';
    return 'healthy';
}

// Get material by ID
export function getMaterial(partId: string): Material | undefined {
    return materials.find(m => m.part_id === partId);
}
