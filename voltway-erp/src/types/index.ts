// Material Master Types
export interface Material {
  part_id: string;
  part_name: string;
  part_type: 'assembly' | 'service' | 'component';
  used_in_models: string[];
  dimensions: string;
  weight: number;
  blocked_parts: string;
  successor_parts: string;
  comment: string;
}

// Stock Level Types
export interface StockLevel {
  part_id: string;
  part_name: string;
  location: 'WH1' | 'WH2' | 'WH3';
  quantity_available: number;
}

// Supplier Types
export interface Supplier {
  supplier_id: string;
  part_id: string;
  price_per_unit: number;
  lead_time_days: number;
  min_order_qty: number;
  reliability_rating: number;
}

// Material Order Types
export interface MaterialOrder {
  order_id: string;
  part_id: string;
  quantity_ordered: number;
  order_date: string;
  expected_delivery_date: string;
  supplier_id: string;
  status: 'ordered' | 'delivered';
  actual_delivered_at?: string;
}

// Sales Order Types
export interface SalesOrder {
  sales_order_id: string;
  model: 'S1' | 'S2' | 'S3';
  version: 'V1' | 'V2';
  quantity: number;
  order_type: 'webshop' | 'fleet_framework' | 'fleet_spot';
  requested_date: string;
  created_at: string;
  accepted_request_date: string;
}

// Dispatch Parameter Types
export interface DispatchParameter {
  part_id: string;
  min_stock_level: number;
  reorder_quantity: number;
  reorder_interval_days: number;
}

// Stock Movement Types
export interface StockMovement {
  movement_id: string;
  part_id: string;
  movement_type: 'inbound' | 'outbound' | 'adjustment';
  quantity: number;
  date: string;
  reference: string;
}

// Event Types
export interface ERPEvent {
  id: string;
  event_type: 'delay' | 'price_change' | 'quality_alert' | 'shipment' | 'discontinuation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affected_orders?: string[];
  affected_materials?: string[];
  created_at: string;
  requires_action: boolean;
}

// KPI Types
export interface KPIData {
  dailyBuildRate: number;
  dailyBuildTarget: number;
  activeStockouts: number;
  onTimeDelivery: number;
  cashFlowProjection: number;
}

// Logistics Types
export interface Shipment {
  id: string;
  supplier: string;
  contents: string;
  eta: string;
  status: 'scheduled' | 'in_transit' | 'delayed' | 'delivered';
  delay_reason?: string;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: number;
  section?: string;
}
