# Product Requirements Document
## AI-Native ERP + Hugo: Procurement AI Agent
### Voltway Electric Scooters

---

**Document Version:** 2.0  
**Last Updated:** December 2025  
**Author:** Product & Engineering Team  
**Status:** Phase 1 Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Why Traditional ERPs Fail](#3-why-traditional-erps-fail)
4. [Product Vision](#4-product-vision)
5. [Phase 1 Scope](#5-phase-1-scope)
6. [Technology Stack](#6-technology-stack)
7. [Data Architecture](#7-data-architecture)
8. [Data Import System](#8-data-import-system)
9. [Core Modules](#9-core-modules)
10. [Problem-to-Solution Mapping](#10-problem-to-solution-mapping)
11. [User Personas & Workflows](#11-user-personas--workflows)
12. [Hugo AI Agent (Phase 2 Preview)](#12-hugo-ai-agent-phase-2-preview)
13. [Success Metrics](#13-success-metrics)
14. [Technical Requirements](#14-technical-requirements)
15. [Implementation Roadmap](#15-implementation-roadmap)
16. [Appendix: Data Dictionary](#appendix-data-dictionary)

---

## 1. Executive Summary

### 1.1 The Opportunity

Industrial procurement is broken. Companies managing physical supply chains are drowning in fragmented data, reactive firefighting, and disconnected tools. The complexity of modern manufacturing—multiple suppliers, volatile demand, engineering changes, global disruptions—has outpaced traditional ERP capabilities.

**Voltway** represents this challenge perfectly: a fast-growing electric scooter manufacturer juggling multiple product configurations, diverse supplier relationships, and demand spanning volatile webshop orders to rigid fleet contracts.

### 1.2 The Solution

This PRD defines an **AI-Native ERP** designed from the ground up to:

1. **Unify all operational data** regardless of source format (CSVs, PDFs, images, emails, spreadsheets)
2. **Enable intelligent reasoning** through a clean, normalized data model
3. **Power Hugo**, an AI procurement agent that transforms data into decisions

**Core Insight:** Hugo cannot exist without a strong data foundation. And data without AI remains static. This system bridges both.

### 1.3 Key Differentiators

| Traditional ERP | AI-Native ERP + Hugo |
|-----------------|----------------------|
| Requires clean, structured input | Ingests any format: PDF, images, emails, spreadsheets |
| Records transactions | Reasons about constraints |
| Static dashboards | Dynamic, conversational insights |
| Module silos | Unified operational graph |
| Reactive alerts | Proactive recommendations |
| Weeks to implement | Days to value |

---

## 2. Problem Statement

### 2.1 The Universal Manufacturing Challenge

Every hardware manufacturer faces the same operational chaos:

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE PROCUREMENT NIGHTMARE                     │
│                                                                  │
│  📧 Supplier emails      →  Scattered across inboxes            │
│  📄 Spec sheets (PDF)    →  Filed away, never searchable        │
│  📊 Inventory data       →  Multiple spreadsheets, outdated     │
│  📋 Purchase orders      →  Disconnected from demand            │
│  📈 Demand forecasts     →  Gut feel, not data-driven           │
│  🔧 Engineering changes  →  Communicated via email, lost        │
│                                                                  │
│  RESULT: Firefighting, stockouts, overstock, missed SLAs        │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Voltway's Specific Context

Voltway manufactures electric scooters with:

- **Multiple product lines** (e.g., S1, S2, S3 series)
- **Version variants** (Standard V1, Premium V2)
- **Complex BOMs** (each configuration requires unique components)
- **Mixed demand channels** (webshop, fleet contracts, spot orders)
- **Multiple suppliers** with varying reliability, pricing, lead times
- **Continuous engineering evolution** (part upgrades, discontinuations)

### 2.3 The Nine Critical Problems

| # | Problem | Business Impact |
|---|---------|-----------------|
| 1 | **Diverse Product Configurations** | BOM complexity, part proliferation |
| 2 | **Assembly vs. Service Parts Compete** | Stockouts for repairs OR production |
| 3 | **Mixed Demand Channels** | Fleet SLA violations, webshop delays |
| 4 | **Warehouse Space Constraints** | Cash tied in overstock, space crunch |
| 5 | **Engineering Changes** | Obsolete inventory, stranded parts |
| 6 | **Inventory Aging** | Silent margin erosion, eventual scrap |
| 7 | **Volatile Supplier Lead Times** | Production schedule chaos |
| 8 | **Price Escalations** | Missed negotiation windows |
| 9 | **Fragmented Data Sources** | No single source of truth |

---

## 3. Why Traditional ERPs Fail

### 3.1 The Input Problem

Traditional ERPs demand structured data entry. Reality delivers:

- **PDF spec sheets** with component tables
- **Scanned invoices** with quantities and prices
- **Email threads** with delivery updates
- **Excel spreadsheets** with inventory counts
- **Images** of packing slips and labels
- **Handwritten notes** from warehouse staff

**Result:** Critical information never enters the system, or requires expensive manual data entry.

### 3.2 The Integration Problem

```
TRADITIONAL ERP ARCHITECTURE:
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Inventory│  │Purchasing│  │  Sales   │  │ Finance  │
│  Module  │  │  Module  │  │  Module  │  │  Module  │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │
     └─────────────┴─────────────┴─────────────┘
                         │
              ┌──────────▼──────────┐
              │   Shared Database   │
              │  (Rigid Schema)     │
              └─────────────────────┘
              
PROBLEM: Each module has its own worldview. Cross-module 
questions require complex joins, custom reports, or exports 
to Excel for manual analysis.
```

### 3.3 The Reasoning Problem

**Question:** "How many S2 Premium scooters can we build next week?"

**Traditional ERP Answer:**
1. Export BOM to Excel
2. Export inventory to Excel
3. Export open POs to Excel
4. Export sales orders to Excel
5. Manually cross-reference
6. Hope nothing changed while you were calculating

**AI-Native ERP Answer:** Instant, always current, considers all constraints.

---

## 4. Product Vision

### 4.1 The Two-Phase Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PHASE 2: HUGO                          │
│                                                                 │
│    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│    │  Analytical │  │  Reactive   │  │  Dispatch   │           │
│    │  Reasoning  │  │Intelligence │  │Optimization │           │
│    │             │  │             │  │             │           │
│    │ "How many   │  │ "Alert:     │  │ "Recommend  │           │
│    │  can we     │  │  supplier   │  │  reorder    │           │
│    │  build?"    │  │  delay!"    │  │  point: 150"│           │
│    └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
│           └────────────────┼────────────────┘                   │
│                            │                                    │
│                     ┌──────▼──────┐                             │
│                     │  LLM + RAG  │                             │
│                     │   Engine    │                             │
│                     └──────┬──────┘                             │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    PHASE 1: AI-NATIVE ERP                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              UNIFIED OPERATIONAL MODEL                    │   │
│  │                                                           │   │
│  │  Materials ←→ Inventory ←→ Orders ←→ Suppliers           │   │
│  │      ↑            ↑           ↑           ↑               │   │
│  │      └────────────┴───────────┴───────────┘               │   │
│  │                         │                                 │   │
│  │              ┌──────────▼──────────┐                      │   │
│  │              │  Firebase/Supabase  │                      │   │
│  │              │   Real-time DB      │                      │   │
│  │              └─────────────────────┘                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              INTELLIGENT DATA IMPORT                      │   │
│  │                                                           │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │   │
│  │  │ PDF │ │ CSV │ │Image│ │Excel│ │Email│ │ JSON│        │   │
│  │  └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘ └──┬──┘        │   │
│  │     └───────┴───────┴───────┴───────┴───────┘            │   │
│  │                         │                                 │   │
│  │              ┌──────────▼──────────┐                      │   │
│  │              │   AI Extraction     │                      │   │
│  │              │   & Normalization   │                      │   │
│  │              └─────────────────────┘                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Design Principles

1. **Any Input, Structured Output:** Accept messy real-world data, produce clean operational records
2. **Real-Time by Default:** Every change instantly available across the system
3. **AI-Ready Schema:** Data structured for LLM reasoning, not just human reporting
4. **Flexible & Extensible:** Adapt to any manufacturing context, not just scooters
5. **Progressive Enhancement:** Works without AI, supercharged with AI

---

## 5. Phase 1 Scope

### 5.1 In Scope (Phase 1 - AI-Native ERP)

| Capability | Description | Priority |
|------------|-------------|----------|
| **Intelligent Data Import** | Ingest PDF, CSV, Excel, images, emails, JSON | P0 |
| **Unified Data Model** | Single source of truth on Firebase/Supabase | P0 |
| **Material Master** | Part catalog with BOM, lifecycle, relationships | P0 |
| **Inventory Management** | Real-time stock, movements, multi-location | P0 |
| **Procurement Module** | PO lifecycle, delivery tracking | P0 |
| **Sales Order Management** | Demand capture, channel classification | P0 |
| **Supplier Intelligence** | Performance, pricing, reliability | P1 |
| **Dispatch Parameters** | Reorder rules, safety stock | P1 |
| **Document Storage** | Original files linked to extracted data | P1 |
| **Basic Alerting** | Rule-based notifications | P1 |
| **Audit Trail** | Full history of all changes | P1 |

### 5.2 Out of Scope (Phase 2 - Hugo)

- Natural language query interface
- Autonomous ordering
- Predictive analytics
- Self-optimizing parameters
- Conversational recommendations

### 5.3 Phase 1 Boundaries

**ERP IS responsible for:**
- Data ingestion and extraction
- Data normalization and validation
- Real-time synchronization
- Deterministic calculations
- Rule-based alerts
- Audit logging

**ERP IS NOT responsible for (yet):**
- Making decisions autonomously
- Predicting future states
- Learning from outcomes
- Generating recommendations

---

## 6. Technology Stack

### 6.1 Database: Firebase vs. Supabase

Both platforms support the AI-Native ERP requirements. Selection criteria:

| Criteria | Firebase | Supabase |
|----------|----------|----------|
| **Real-time sync** | ✅ Native | ✅ Native |
| **Scalability** | ✅ Excellent | ✅ Excellent |
| **SQL queries** | ❌ NoSQL only | ✅ Full PostgreSQL |
| **Complex joins** | ⚠️ Client-side | ✅ Server-side |
| **File storage** | ✅ Cloud Storage | ✅ S3-compatible |
| **Auth** | ✅ Firebase Auth | ✅ Auth built-in |
| **Pricing** | Pay-per-read/write | Predictable tiers |
| **Self-hosting** | ❌ No | ✅ Yes |
| **Vendor lock-in** | Higher | Lower |

**Recommendation:** 
- **Supabase** for complex relational queries (inventory, BOM traversal)
- **Firebase** for real-time dashboards and simpler data models
- **Hybrid** possible: Supabase for core data, Firebase for real-time features

### 6.2 Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│                   React / Next.js / Vue                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      API LAYER                                   │
│              Supabase Edge Functions / Firebase Functions        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Import     │  │    CRUD      │  │   Business   │           │
│  │   Handlers   │  │    APIs      │  │    Logic     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      DATA LAYER                                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  SUPABASE / FIREBASE                     │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │    │
│  │  │  Postgres  │  │  Storage   │  │  Real-time │         │    │
│  │  │   Tables   │  │   Bucket   │  │   Subs     │         │    │
│  │  └────────────┘  └────────────┘  └────────────┘         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  AI SERVICES                             │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │    │
│  │  │  Claude /  │  │  Document  │  │   Vision   │         │    │
│  │  │   GPT-4    │  │   AI       │  │    API     │         │    │
│  │  └────────────┘  └────────────┘  └────────────┘         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 AI Services for Data Extraction

| Service | Use Case | Provider Options |
|---------|----------|------------------|
| **Document OCR** | Extract text from scanned PDFs, images | Google Vision, AWS Textract, Azure Form Recognizer |
| **Table Extraction** | Parse tables from PDFs, images | Anthropic Claude, OpenAI GPT-4V, Camelot |
| **Email Parsing** | Extract structured events from emails | Claude, GPT-4, custom NLP |
| **Data Normalization** | Map extracted fields to schema | Claude, GPT-4 with few-shot |
| **Entity Resolution** | Match parts, suppliers across sources | Embeddings + similarity search |

---

## 7. Data Architecture

### 7.1 Core Schema Design

The schema is designed to be **flexible** and **extensible**. Field names and relationships can adapt to any manufacturing context.

```
┌─────────────────────────────────────────────────────────────────┐
│                     CORE ENTITIES                                │
│                                                                  │
│  ┌─────────────┐         ┌─────────────┐         ┌───────────┐  │
│  │  MATERIALS  │◄───────►│   BOMS      │◄───────►│  PRODUCTS │  │
│  │             │         │             │         │           │  │
│  │ - part_id   │         │ - product   │         │ - model   │  │
│  │ - name      │         │ - part_id   │         │ - version │  │
│  │ - type      │         │ - quantity  │         │ - name    │  │
│  │ - status    │         │ - notes     │         │ - status  │  │
│  └──────┬──────┘         └─────────────┘         └───────────┘  │
│         │                                                        │
│         │         ┌─────────────┐         ┌─────────────┐       │
│         ├────────►│  INVENTORY  │         │  SUPPLIERS  │       │
│         │         │             │         │             │       │
│         │         │ - part_id   │         │ - id        │       │
│         │         │ - location  │         │ - name      │       │
│         │         │ - quantity  │         │ - contact   │       │
│         │         │ - status    │         │ - rating    │       │
│         │         └─────────────┘         └──────┬──────┘       │
│         │                                        │               │
│         │         ┌─────────────┐         ┌──────▼──────┐       │
│         └────────►│  MOVEMENTS  │         │SUPPLIER_PARTS│      │
│                   │             │         │             │       │
│                   │ - part_id   │         │ - supplier  │       │
│                   │ - type      │         │ - part_id   │       │
│                   │ - quantity  │         │ - price     │       │
│                   │ - date      │         │ - lead_time │       │
│                   └─────────────┘         └─────────────┘       │
│                                                                  │
│  ┌─────────────┐         ┌─────────────┐         ┌───────────┐  │
│  │PURCHASE_    │◄───────►│ SALES_      │         │  DISPATCH │  │
│  │ORDERS       │         │ ORDERS      │         │  PARAMS   │  │
│  │             │         │             │         │           │  │
│  │ - order_id  │         │ - order_id  │         │ - part_id │  │
│  │ - part_id   │         │ - product   │         │ - reorder │  │
│  │ - supplier  │         │ - quantity  │         │ - lot_size│  │
│  │ - status    │         │ - channel   │         │ - safety  │  │
│  └─────────────┘         └─────────────┘         └───────────┘  │
│                                                                  │
│  ┌─────────────┐         ┌─────────────┐                        │
│  │  DOCUMENTS  │◄───────►│   EVENTS    │                        │
│  │             │         │             │                        │
│  │ - file_url  │         │ - type      │                        │
│  │ - type      │         │ - source    │                        │
│  │ - extracted │         │ - affects   │                        │
│  │ - status    │         │ - action    │                        │
│  └─────────────┘         └─────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Supabase Schema (PostgreSQL)

```sql
-- =====================================================
-- CORE TABLES
-- =====================================================

-- Materials / Parts Catalog
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    part_type VARCHAR(50) DEFAULT 'component', -- component, assembly, service, raw
    category VARCHAR(100),
    unit_of_measure VARCHAR(20) DEFAULT 'EA',
    weight_kg DECIMAL(10,3),
    dimensions JSONB, -- {length, width, height, unit}
    status VARCHAR(20) DEFAULT 'active', -- active, blocked, discontinued, phasing_out
    blocked_reason TEXT,
    successor_id UUID REFERENCES materials(id),
    metadata JSONB, -- flexible additional fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products (Finished Goods)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(model, version)
);

-- Bill of Materials
CREATE TABLE bom_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE RESTRICT,
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
    unit VARCHAR(20) DEFAULT 'EA',
    position VARCHAR(50), -- assembly position/location
    notes TEXT,
    is_optional BOOLEAN DEFAULT FALSE,
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warehouse Locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- warehouse, zone, bin, staging
    parent_id UUID REFERENCES locations(id),
    capacity_units INTEGER,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Levels
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    quantity_available DECIMAL(10,3) DEFAULT 0,
    quantity_reserved DECIMAL(10,3) DEFAULT 0,
    quantity_blocked DECIMAL(10,3) DEFAULT 0,
    lot_number VARCHAR(50),
    expiry_date DATE,
    last_count_date DATE,
    metadata JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(material_id, location_id, lot_number)
);

-- Stock Movements
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(id),
    location_id UUID REFERENCES locations(id),
    movement_type VARCHAR(20) NOT NULL, -- inbound, outbound, transfer, adjustment
    quantity DECIMAL(10,3) NOT NULL,
    reference_type VARCHAR(50), -- purchase_order, sales_order, adjustment, transfer
    reference_id UUID,
    reason TEXT,
    performed_by UUID,
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(100),
    email VARCHAR(200),
    phone VARCHAR(50),
    address JSONB,
    payment_terms VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'USD',
    reliability_rating DECIMAL(3,2), -- 0.00 to 1.00
    status VARCHAR(20) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier-Material Relationships (Sourcing)
CREATE TABLE supplier_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    supplier_part_number VARCHAR(100),
    price_per_unit DECIMAL(12,4),
    currency VARCHAR(3) DEFAULT 'USD',
    lead_time_days INTEGER,
    min_order_quantity DECIMAL(10,3),
    order_multiple DECIMAL(10,3),
    is_preferred BOOLEAN DEFAULT FALSE,
    contract_reference VARCHAR(100),
    price_valid_from DATE,
    price_valid_to DATE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(supplier_id, material_id)
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, confirmed, partial, received, cancelled
    order_date DATE,
    expected_date DATE,
    actual_delivery_date DATE,
    total_value DECIMAL(14,2),
    currency VARCHAR(3) DEFAULT 'USD',
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Order Lines
CREATE TABLE purchase_order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id),
    quantity_ordered DECIMAL(10,3) NOT NULL,
    quantity_received DECIMAL(10,3) DEFAULT 0,
    unit_price DECIMAL(12,4),
    line_total DECIMAL(14,2),
    expected_date DATE,
    metadata JSONB
);

-- Sales Orders
CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(200),
    customer_reference VARCHAR(100),
    channel VARCHAR(50), -- webshop, fleet_framework, fleet_spot, wholesale
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, in_production, shipped, completed, cancelled
    priority INTEGER DEFAULT 5, -- 1 highest, 10 lowest
    requested_date DATE,
    committed_date DATE,
    shipped_date DATE,
    total_value DECIMAL(14,2),
    currency VARCHAR(3) DEFAULT 'USD',
    contract_reference VARCHAR(100),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales Order Lines
CREATE TABLE sales_order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sales_order_id UUID REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,4),
    line_total DECIMAL(14,2),
    metadata JSONB
);

-- Dispatch Parameters (Inventory Planning)
CREATE TABLE dispatch_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE UNIQUE,
    reorder_point DECIMAL(10,3),
    reorder_quantity DECIMAL(10,3),
    safety_stock DECIMAL(10,3),
    max_stock DECIMAL(10,3),
    reorder_interval_days INTEGER,
    auto_reorder BOOLEAN DEFAULT FALSE,
    review_cycle VARCHAR(20), -- daily, weekly, monthly
    last_reviewed_at TIMESTAMPTZ,
    metadata JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DOCUMENT & EVENT TRACKING
-- =====================================================

-- Imported Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50), -- pdf, csv, xlsx, jpg, png, eml, json
    file_url TEXT NOT NULL, -- Storage URL
    file_size INTEGER,
    source VARCHAR(100), -- upload, email, api, integration
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, processed, failed
    extraction_result JSONB, -- Extracted structured data
    extraction_confidence DECIMAL(3,2),
    processed_at TIMESTAMPTZ,
    error_message TEXT,
    linked_entities JSONB, -- [{type: 'purchase_order', id: '...'}, ...]
    metadata JSONB,
    uploaded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier Communications / Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL, -- delay, price_change, quality_alert, shipment, discontinuation
    source VARCHAR(50), -- email, phone, portal, document
    source_document_id UUID REFERENCES documents(id),
    supplier_id UUID REFERENCES suppliers(id),
    title VARCHAR(200),
    description TEXT,
    severity VARCHAR(20), -- info, warning, critical
    affected_orders JSONB, -- [order_ids]
    affected_materials JSONB, -- [material_ids]
    extracted_data JSONB, -- Structured event data
    requires_action BOOLEAN DEFAULT FALSE,
    action_deadline DATE,
    action_taken TEXT,
    resolved_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUDIT & HISTORY
-- =====================================================

-- Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_materials_part_id ON materials(part_id);
CREATE INDEX idx_materials_status ON materials(status);
CREATE INDEX idx_inventory_material ON inventory(material_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);
CREATE INDEX idx_stock_movements_material ON stock_movements(material_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(performed_at);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_sales_orders_channel ON sales_orders(channel);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_supplier ON events(supplier_id);
CREATE INDEX idx_documents_status ON documents(status);

-- =====================================================
-- REAL-TIME SUBSCRIPTIONS (Supabase)
-- =====================================================

-- Enable real-time for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE purchase_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE sales_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
```

### 7.3 Firebase Schema (NoSQL Alternative)

```javascript
// Firestore Collection Structure

// /materials/{materialId}
{
  partId: "P300",
  name: "500W Brushless Motor",
  type: "assembly",
  status: "active",
  usedInModels: ["S1_V1", "S2_V1"],
  successorId: "P304",
  metadata: {},
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// /products/{productId}
{
  model: "S1",
  version: "V2",
  name: "S1 V2 Pro",
  status: "active",
  bom: [
    { materialId: "P304", quantity: 1, notes: "" },
    { materialId: "P305", quantity: 1, notes: "" },
    // ...
  ],
  createdAt: Timestamp
}

// /inventory/{inventoryId}
{
  materialId: "P304",
  locationCode: "WH1",
  available: 108,
  reserved: 20,
  blocked: 0,
  updatedAt: Timestamp
}

// /purchaseOrders/{orderId}
{
  orderNumber: "O5000",
  supplierId: "SupA",
  status: "ordered",
  lines: [
    { materialId: "P312", quantity: 32, received: 0 }
  ],
  expectedDate: Timestamp,
  createdAt: Timestamp
}

// /events/{eventId}
{
  type: "delay",
  supplierId: "SupA",
  title: "Delivery delay for O5007",
  severity: "warning",
  affectedOrders: ["O5007"],
  affectedMaterials: ["P300"],
  extractedData: {
    originalDate: "2025-03-20",
    newDate: "2025-04-05",
    reason: "tooling issue"
  },
  sourceDocumentId: "doc123",
  requiresAction: true,
  createdAt: Timestamp
}
```

---

## 8. Data Import System

### 8.1 Supported Import Formats

The system accepts any file format containing operational data:

| Format | Extensions | Use Cases | Extraction Method |
|--------|------------|-----------|-------------------|
| **PDF** | .pdf | Spec sheets, invoices, contracts, packing slips | OCR + LLM extraction |
| **Images** | .jpg, .jpeg, .png, .gif, .webp, .tiff | Scanned documents, photos of labels, whiteboard notes | Vision AI + OCR |
| **Spreadsheets** | .xlsx, .xls, .csv, .tsv | Inventory exports, price lists, order batches | Direct parsing |
| **Email** | .eml, .msg | Supplier communications, order confirmations | Email parser + NLP |
| **Documents** | .docx, .doc | Contracts, procedures, specifications | Text extraction + NLP |
| **Structured** | .json, .xml | API exports, system integrations | Direct parsing |
| **Archives** | .zip | Batch imports | Extract and process each file |

### 8.2 Import Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     IMPORT PIPELINE                              │
│                                                                  │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌────────┐ │
│  │  Upload  │────►│  Store   │────►│  Queue   │────►│Process │ │
│  │  File    │     │  File    │     │  Job     │     │  Job   │ │
│  └──────────┘     └──────────┘     └──────────┘     └────┬───┘ │
│                                                          │      │
│                     ┌────────────────────────────────────┘      │
│                     ▼                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 PROCESSING ENGINE                        │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │  │  Detect  │  │ Extract  │  │  Parse   │              │   │
│  │  │   Type   │  │   Text   │  │  Tables  │              │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘              │   │
│  │       │             │             │                     │   │
│  │       └─────────────┴─────────────┘                     │   │
│  │                     │                                    │   │
│  │              ┌──────▼──────┐                            │   │
│  │              │     LLM     │                            │   │
│  │              │  Extraction │                            │   │
│  │              │   Engine    │                            │   │
│  │              └──────┬──────┘                            │   │
│  │                     │                                    │   │
│  │  ┌──────────────────▼──────────────────┐               │   │
│  │  │        EXTRACTION RESULT            │               │   │
│  │  │  {                                  │               │   │
│  │  │    type: "spec_sheet",              │               │   │
│  │  │    confidence: 0.95,                │               │   │
│  │  │    entities: {                      │               │   │
│  │  │      product: "S1 V2 Pro",          │               │   │
│  │  │      bom_items: [...],              │               │   │
│  │  │      assembly_notes: [...]          │               │   │
│  │  │    }                                │               │   │
│  │  │  }                                  │               │   │
│  │  └─────────────────────────────────────┘               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│                     ┌──────────┐     ┌──────────┐              │
│                     │ Validate │────►│  Store   │              │
│                     │  Data    │     │  Records │              │
│                     └──────────┘     └──────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Extraction Templates

The system uses **extraction templates** to understand different document types:

```javascript
// Template: Spec Sheet / BOM
const specSheetTemplate = {
  documentType: "spec_sheet",
  detectPatterns: [
    "bill of materials",
    "bom",
    "parts list",
    "assembly requirements"
  ],
  extractFields: {
    product: {
      type: "object",
      fields: {
        model: { type: "string", patterns: ["model", "product"] },
        version: { type: "string", patterns: ["version", "v1", "v2"] },
        name: { type: "string", patterns: ["name", "title"] },
        description: { type: "string", patterns: ["overview", "description"] }
      }
    },
    bomItems: {
      type: "array",
      itemFields: {
        partId: { type: "string", patterns: ["part id", "part #", "p/n"] },
        partName: { type: "string", patterns: ["part name", "description"] },
        quantity: { type: "number", patterns: ["qty", "quantity"] },
        notes: { type: "string", patterns: ["notes", "remarks"] }
      }
    },
    assemblyNotes: {
      type: "array",
      patterns: ["assembly requirements", "instructions", "notes"]
    }
  }
};

// Template: Supplier Email
const supplierEmailTemplate = {
  documentType: "supplier_email",
  detectPatterns: ["from:", "subject:", "dear", "regards"],
  extractFields: {
    sender: { type: "string", patterns: ["from"] },
    subject: { type: "string", patterns: ["subject"] },
    date: { type: "date", patterns: ["date", "sent"] },
    eventType: {
      type: "enum",
      values: ["delay", "price_change", "quality_alert", "shipment", 
               "discontinuation", "proposal", "discount"],
      detectFromContent: true
    },
    affectedOrders: { 
      type: "array", 
      patterns: ["order", "po", "purchase order", "o\\d{4}"] 
    },
    affectedParts: { 
      type: "array", 
      patterns: ["part", "p\\d{3}", "sku"] 
    },
    dates: {
      type: "object",
      fields: {
        originalDate: { patterns: ["original", "was", "from"] },
        newDate: { patterns: ["new", "now", "to", "updated"] },
        deadline: { patterns: ["by", "deadline", "before"] }
      }
    },
    pricing: {
      type: "object",
      fields: {
        oldPrice: { patterns: ["from", "was", "current"] },
        newPrice: { patterns: ["to", "new", "updated"] },
        discount: { patterns: ["discount", "off", "%"] }
      }
    }
  }
};

// Template: Invoice / Packing Slip
const invoiceTemplate = {
  documentType: "invoice",
  detectPatterns: ["invoice", "packing slip", "delivery note", "bill to"],
  extractFields: {
    documentNumber: { type: "string", patterns: ["invoice #", "number"] },
    supplier: { type: "string", patterns: ["from", "vendor", "supplier"] },
    date: { type: "date", patterns: ["date", "issued"] },
    lineItems: {
      type: "array",
      itemFields: {
        partId: { type: "string" },
        description: { type: "string" },
        quantity: { type: "number" },
        unitPrice: { type: "number" },
        total: { type: "number" }
      }
    },
    totals: {
      type: "object",
      fields: {
        subtotal: { type: "number" },
        tax: { type: "number" },
        total: { type: "number" }
      }
    }
  }
};
```

### 8.4 Import Workflow UI

```
┌─────────────────────────────────────────────────────────────────┐
│  IMPORT DATA                                              [X]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │     📁 Drop files here or click to browse                │  │
│  │                                                           │  │
│  │     Supported: PDF, Images, Excel, CSV, Email, JSON      │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Recent Imports:                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 📄 S1_V2_specs.pdf          ✅ Processed    [View] [Link]│  │
│  │    Extracted: 1 product, 14 BOM items                     │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 📧 supplier_delay.eml       ✅ Processed    [View] [Link]│  │
│  │    Event: Delay for O5007, new date 2025-04-05           │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 📊 inventory_export.xlsx    ⏳ Processing...              │  │
│  │    Detecting structure...                                 │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ 📷 packing_slip.jpg         ⚠️ Needs Review  [Review]    │  │
│  │    Low confidence on quantity field                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                        [Import More] [Done]     │
└─────────────────────────────────────────────────────────────────┘
```

### 8.5 Review & Confirm UI

When extraction confidence is below threshold or manual review is required:

```
┌─────────────────────────────────────────────────────────────────┐
│  REVIEW IMPORT: S1_V2_specs.pdf                          [X]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┬───────────────────────────────┐   │
│  │                         │  EXTRACTED DATA               │   │
│  │   [PDF Preview]         │                               │   │
│  │                         │  Product:                     │   │
│  │   Page 1 of 1           │  ┌─────────────────────────┐  │   │
│  │                         │  │ Model:   [S1    ▼]      │  │   │
│  │  ┌─────────────────┐    │  │ Version: [V2    ▼]      │  │   │
│  │  │  Voltway S1 V2  │    │  │ Name:    [S1 V2 Pro   ] │  │   │
│  │  │      Pro        │    │  └─────────────────────────┘  │   │
│  │  │                 │    │                               │   │
│  │  │ Bill of Mater.. │    │  BOM Items:                   │   │
│  │  │                 │    │  ┌────────┬────────┬─────┐   │   │
│  │  │ P304 750W Motor │    │  │Part ID │Name    │ Qty │   │   │
│  │  │ P305 Li-Po Bat..│    │  ├────────┼────────┼─────┤   │   │
│  │  │ P306 Digital C..│    │  │ P304   │750W Mo.│  1  │   │   │
│  │  │ ...             │    │  │ P305   │Li-Po B.│  1  │   │   │
│  │  │                 │    │  │ P306   │Digital.│  1  │   │   │
│  │  └─────────────────┘    │  │ P307   │Carbon .│  1  │   │   │
│  │                         │  │ P330   │12-inch.│  2  │ ⚠️│   │
│  │                         │  │ ...    │...     │ ... │   │   │
│  │                         │  └────────┴────────┴─────┘   │   │
│  │                         │                               │   │
│  │                         │  ⚠️ P330 quantity differs from│   │
│  │                         │     existing BOM (was 1)      │   │
│  │                         │     [Keep New] [Keep Old]     │   │
│  └─────────────────────────┴───────────────────────────────┘   │
│                                                                  │
│  Confidence: 94%                                                 │
│                                                                  │
│                              [Cancel] [Save as Draft] [Confirm] │
└─────────────────────────────────────────────────────────────────┘
```

### 8.6 Batch Import API

```typescript
// Import API Endpoint
POST /api/import

// Request (multipart/form-data)
{
  files: File[],           // One or more files
  options: {
    autoLink: boolean,     // Auto-link to existing entities
    createMissing: boolean, // Create new entities if not found
    overwriteExisting: boolean, // Update existing records
    reviewRequired: boolean, // Always require manual review
    notifyOnComplete: boolean
  }
}

// Response
{
  jobId: "import_abc123",
  status: "processing",
  filesReceived: 3,
  estimatedTime: "30 seconds",
  trackingUrl: "/api/import/abc123/status"
}

// Status Check
GET /api/import/{jobId}/status

{
  jobId: "import_abc123",
  status: "completed", // pending, processing, review_required, completed, failed
  files: [
    {
      fileName: "S1_V2_specs.pdf",
      status: "completed",
      confidence: 0.94,
      extractedType: "spec_sheet",
      entitiesCreated: {
        products: 1,
        bomItems: 14
      },
      warnings: []
    },
    {
      fileName: "inventory.xlsx",
      status: "review_required",
      confidence: 0.72,
      extractedType: "inventory_export",
      reviewUrl: "/app/import/review/xyz789",
      warnings: ["Column 'qty' has mixed formats"]
    }
  ],
  summary: {
    totalFiles: 3,
    processed: 2,
    needsReview: 1,
    failed: 0
  }
}
```

---

## 9. Core Modules

### 9.1 Material Master Module

**Purpose:** Single source of truth for all components, assemblies, and service parts.

**Key Features:**
- Flexible part hierarchy (raw materials → components → assemblies → products)
- Lifecycle management (active, blocked, discontinued, successor)
- Cross-reference to all products using each part
- Custom metadata fields for industry-specific attributes

**Import Sources:**
- PDF spec sheets (BOM extraction)
- Excel/CSV part lists
- Supplier catalogs
- ERP exports

**Schema Fields:**
| Field | Type | Description |
|-------|------|-------------|
| part_id | string | Unique identifier |
| name | string | Descriptive name |
| type | enum | component, assembly, service, raw |
| status | enum | active, blocked, discontinued |
| successor_id | reference | Replacement part when discontinued |
| used_in_products | array | Products containing this part |
| metadata | json | Flexible additional fields |

### 9.2 Inventory Module

**Purpose:** Real-time visibility into stock levels across all locations.

**Key Features:**
- Multi-location tracking
- Lot/batch tracking with expiry
- Stock status (available, reserved, blocked, in-transit)
- Movement history with full audit trail

**Import Sources:**
- Warehouse management exports (CSV, Excel)
- Barcode scan uploads (CSV)
- Physical count sheets (Excel, images)
- Packing slips (PDF, images)

**Calculated Fields:**
| Metric | Calculation |
|--------|-------------|
| Total Stock | available + reserved + blocked |
| Available to Promise | available - reserved |
| Days of Stock | available / avg_daily_consumption |
| Reorder Alert | available < reorder_point |

### 9.3 Procurement Module

**Purpose:** Manage purchase orders from creation through receipt.

**Key Features:**
- Multi-line purchase orders
- Supplier selection with price/lead time comparison
- Delivery tracking with variance analysis
- Partial shipment handling

**Import Sources:**
- Supplier confirmations (email, PDF)
- Shipping notifications (email)
- Invoices (PDF, images)
- Packing slips (PDF, images)

**Order Lifecycle:**
```
draft → sent → confirmed → partial → received → closed
                  ↓
               cancelled
```

### 9.4 Sales Order Module

**Purpose:** Capture demand from all channels with delivery commitment tracking.

**Key Features:**
- Channel classification for priority handling
- SLA tracking per order type
- Capacity checking against BOM requirements
- Backlog visibility

**Import Sources:**
- Webshop exports (CSV, JSON, API)
- Fleet contracts (PDF, Word)
- Email orders
- EDI/API integrations

**Order Types:**
| Type | Priority | SLA | Characteristics |
|------|----------|-----|-----------------|
| webshop | Standard | 5-7 days | Variable, price-sensitive |
| fleet_framework | High | Per contract | Committed volumes, penalties |
| fleet_spot | Medium | Negotiated | One-time, larger orders |
| wholesale | Low | Flexible | B2B, bulk pricing |

### 9.5 Supplier Module

**Purpose:** Track supplier capabilities, performance, and enable sourcing decisions.

**Key Features:**
- Multiple sources per part with price/lead time
- Performance scoring based on delivery history
- Contract and pricing management
- Communication history

**Import Sources:**
- Price lists (PDF, Excel)
- Contracts (PDF, Word)
- Supplier emails
- Performance reports

**Performance Metrics:**
| Metric | Calculation |
|--------|-------------|
| On-Time Delivery % | orders_on_time / total_orders |
| Quality Score | accepted_qty / received_qty |
| Price Trend | current_price / avg_historical_price |
| Reliability Rating | weighted(OTD, Quality, Responsiveness) |

### 9.6 Events Module

**Purpose:** Capture and track operational events from all sources.

**Key Features:**
- Automatic event extraction from emails/documents
- Linking to affected orders and materials
- Action tracking and escalation
- Event timeline visualization

**Event Types:**
| Type | Severity | Auto-Actions |
|------|----------|--------------|
| delay | warning | Update PO dates, alert warehouse |
| price_change | info | Alert procurement, flag for review |
| quality_alert | critical | Block stock, halt production, escalate |
| discontinuation | warning | Alert engineering, flag for BOM update |
| partial_shipment | info | Update received quantities |
| discount | info | Alert procurement for opportunity |

### 9.7 Documents Module

**Purpose:** Store original files linked to extracted data with full traceability.

**Key Features:**
- Secure file storage (Supabase Storage / Firebase Storage)
- Extraction history and confidence scores
- Version tracking for updated documents
- Search across document content

**Document Lifecycle:**
```
uploaded → processing → extracted → linked → archived
              ↓
           failed (with error log)
```

---

## 10. Problem-to-Solution Mapping

### 10.1 Comprehensive Solution Matrix

| # | Problem | ERP Solution (Phase 1) | Import Capability | Hugo Enhancement (Phase 2) |
|---|---------|------------------------|-------------------|---------------------------|
| 1 | **Diverse Configurations** | Flexible BOM structure | PDF spec extraction | "How many can we build?" |
| 2 | **Assembly vs. Service** | Demand type tagging | Order classification | Allocation optimization |
| 3 | **Mixed Demand Channels** | Channel-based priority | Multi-source import | SLA risk prediction |
| 4 | **Warehouse Constraints** | Multi-location tracking | Inventory scan import | Space optimization |
| 5 | **Engineering Changes** | Part lifecycle states | ECO document import | Change impact analysis |
| 6 | **Inventory Aging** | Age tracking, FIFO | Historical data import | Consumption recommendations |
| 7 | **Volatile Lead Times** | Historical tracking | Delivery email parsing | Delay prediction |
| 8 | **Price Escalations** | Price history | Quote/invoice extraction | Negotiation timing |
| 9 | **Fragmented Data** | Unified model | Any-format import | Cross-source reasoning |

### 10.2 Example: Engineering Change Flow

```
SCENARIO: Supplier discontinuing LCD Display (P324)

1. EMAIL ARRIVES
   From: product-updates@supA.com
   Subject: Discontinuation of LCD Dashboard Display
   "We're discontinuing LCD Dashboard Display (P324) at end of Q2 2025.
    Last buy date is 2025-06-15."

2. IMPORT SYSTEM PROCESSES
   - Detects: supplier_email, event_type: discontinuation
   - Extracts: part P324, deadline 2025-06-15
   - Creates: Event record with critical severity

3. ERP ACTIONS (Automatic)
   ✓ Create event linked to P324
   ✓ Flag P324 as "phasing_out"
   ✓ Alert engineering team
   ✓ Calculate current stock vs. projected demand
   ✓ Identify affected products (S1_V1, S2_V1, S3_V1)

4. DASHBOARD SHOWS
   ⚠️ P324 Discontinuation Alert
   - Current stock: 44 units
   - Demand through Q2: 120 units
   - Gap: 76 units
   - Last buy deadline: 2025-06-15
   - Successor: P329 (OLED Display)
   [Create Final PO] [View Affected Products] [Plan Transition]

5. HUGO (Phase 2) WOULD ADD
   "I recommend placing a final order for 80 units of P324 by May 15th.
    This covers Q2 demand plus 10% buffer for service parts.
    Meanwhile, engineering should validate P329 as drop-in replacement.
    Cost impact: $5,500 for final buy vs. $12,000 for redesign."
```

---

## 11. User Personas & Workflows

### 11.1 Primary Personas

**Jordan - Warehouse Manager**
- **Goal:** Right parts, right place, right time
- **Key Tasks:** Receiving, picking, cycle counts, space management
- **Import Needs:** Packing slips, count sheets, transfer documents

**Maria - Procurement Specialist**
- **Goal:** Best price without supply risk
- **Key Tasks:** Supplier management, PO creation, price negotiation
- **Import Needs:** Supplier emails, price lists, contracts, invoices

**David - Operations Director**
- **Goal:** Meet commitments profitably
- **Key Tasks:** Capacity planning, KPI review, exception handling
- **Import Needs:** Executive reports, demand forecasts, performance data

**Alex - Production Planner**
- **Goal:** Smooth production flow
- **Key Tasks:** Build scheduling, material allocation, shortage resolution
- **Import Needs:** Production schedules, BOM updates, quality reports

### 11.2 Workflow: Import Supplier Price Update

```
MARIA receives email with new price list PDF

Step 1: Forward to system OR upload via UI
        Email: import@voltway.erp.ai
        OR: Drag-drop to Import panel

Step 2: System processes automatically
        - Detects: PDF, supplier price list
        - Extracts: 25 line items with prices
        - Matches: 23 parts found, 2 new parts detected
        
Step 3: Review screen shows
        ┌─────────────────────────────────────────────────┐
        │ PRICE UPDATE: SupB Price List Q2 2025          │
        │                                                 │
        │ ✅ 23 parts matched                             │
        │ ⚠️ 2 new parts detected                        │
        │ 📊 5 prices increased, 3 decreased, 15 same    │
        │                                                 │
        │ Notable changes:                                │
        │ • P305 Li-Po Battery: $68.83 → $72.50 (+5.3%)  │
        │ • P330 12-inch Wheel: $103.78 → $98.50 (-5.1%) │
        │                                                 │
        │ [Review Details] [Accept All] [Reject]         │
        └─────────────────────────────────────────────────┘

Step 4: Maria clicks [Accept All]
        - 23 supplier_materials records updated
        - Price history logged
        - Event created for significant changes
        - Original PDF linked to records
```

### 11.3 Workflow: Daily Operations Dashboard

```
DAVID opens dashboard at 8:00 AM

┌─────────────────────────────────────────────────────────────────┐
│  OPERATIONS DASHBOARD                     December 28, 2025     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │  BUILD CAPACITY │ │   ALERTS (5)    │ │  ORDERS TODAY   │   │
│  │                 │ │                 │ │                 │   │
│  │   S1 V1: 158    │ │ 🔴 P305 Critical│ │ 📦 12 to ship   │   │
│  │   S1 V2: 13 ⚠️  │ │ 🟡 P330 Low     │ │ 📥 3 received   │   │
│  │   S2 V1: 20     │ │ 🟡 P332 Low     │ │ 📋 8 new orders │   │
│  │   S2 V2: 0 🔴   │ │ 🔵 Price change │ │                 │   │
│  │   S3 V1: 57     │ │ 🔵 Delay notice │ │ Value: $45,200  │   │
│  │   S3 V2: 59     │ │                 │ │                 │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│                                                                  │
│  INCOMING SHIPMENTS (Next 7 Days)                               │
│  ┌────────┬──────────┬───────────┬───────────┬────────────┐    │
│  │ Date   │ Supplier │ Parts     │ Quantity  │ Status     │    │
│  ├────────┼──────────┼───────────┼───────────┼────────────┤    │
│  │ Dec 29 │ SupB     │ P330      │ 51        │ In Transit │    │
│  │ Dec 30 │ SupA     │ P332      │ 102       │ Shipped    │    │
│  │ Jan 02 │ SupC     │ P305      │ 30        │ Confirmed  │    │
│  └────────┴──────────┴───────────┴───────────┴────────────┘    │
│                                                                  │
│  RECENT IMPORTS                                                  │
│  • supplier_email.eml - Delay notice processed (2 hrs ago)      │
│  • inventory_count.xlsx - 150 records updated (yesterday)       │
│  • S3_V2_specs.pdf - BOM extracted, 2 changes detected          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Hugo AI Agent (Phase 2 Preview)

### 12.1 Hugo Capabilities

Once Phase 1 ERP provides clean, unified data, Hugo enables:

**Natural Language Queries**
```
User: "What's causing the S1 V2 bottleneck?"

Hugo: "S1 V2 is constrained by P330 (12-inch Alloy Wheels).
       
       Current situation:
       • Stock: 26 wheels (need 2 per scooter = 13 builds max)
       • Open POs: 167 wheels arriving by Jan 5
       • Demand backlog: 45 S1 V2 units
       
       Root cause: Supplier lead time increased from 12 to 19 days
       last month. Reorder point wasn't adjusted.
       
       Recommendation: Increase P330 safety stock to 60 units
       and consider adding SupC as backup (same price, 12-day lead)."
```

**Proactive Alerts**
```
Hugo Alert: Framework Contract Risk

Contract FC-S60034 with Fleet Giant requires 150 S2 V2 units
in January. Current build capacity: 0 (blocked by P312, P313).

Analysis:
• P312 blocked for quality issues since Dec 10
• P313 under safety recall since Dec 5
• No ETA for resolution

Actions needed:
1. Escalate P312/P313 status with suppliers
2. Communicate delay risk to Fleet Giant
3. Consider penalty clause implications (~$15,000)

[View Contract] [Draft Customer Email] [Escalate Internally]
```

**Optimization Suggestions**
```
Hugo Weekly Digest: Dispatch Parameter Review

Based on 30-day consumption patterns, I recommend these changes:

┌────────┬─────────────┬─────────────┬──────────────────────┐
│ Part   │ Current ROP │ Suggested   │ Reason               │
├────────┼─────────────┼─────────────┼──────────────────────┤
│ P305   │ 75          │ 150         │ Lead time volatility │
│ P330   │ 44          │ 80          │ Demand increase +40% │
│ P302   │ 41          │ 25          │ V1 phase-out, excess │
│ P333   │ 64          │ 45          │ Stable supply, lower │
└────────┴─────────────┴─────────────┴──────────────────────┘

Estimated impact:
• Stockout risk: -60%
• Inventory investment: +$8,000 (P305, P330)
• Savings from reduced P302, P333: $3,500
• Net: +$4,500 working capital, much lower risk

[Apply All] [Review Each] [Dismiss]
```

### 12.2 Hugo Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         HUGO AI AGENT                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    QUERY INTERFACE                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │   Chat UI   │  │  Slack Bot  │  │  Email Bot  │       │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │  │
│  │         └────────────────┼────────────────┘              │  │
│  └──────────────────────────┼────────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │                   REASONING ENGINE                        │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  │
│  │  │   Intent    │  │   Context   │  │   Response  │       │  │
│  │  │   Parser    │  │   Builder   │  │   Generator │       │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │  │
│  │         │                │                │              │  │
│  │         ▼                ▼                ▼              │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │                    LLM (Claude)                     │ │  │
│  │  │  • Query understanding                              │ │  │
│  │  │  • Multi-step reasoning                             │ │  │
│  │  │  • Recommendation generation                        │ │  │
│  │  │  • Natural language response                        │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │                   DATA ACCESS LAYER                       │  │
│  │                                                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │  │ Materials│ │Inventory │ │  Orders  │ │Suppliers │    │  │
│  │  │   API    │ │   API    │ │   API    │ │   API    │    │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
               ┌─────────────────────────┐
               │   PHASE 1 ERP DATABASE  │
               │    (Supabase/Firebase)  │
               └─────────────────────────┘
```

---

## 13. Success Metrics

### 13.1 Phase 1 Metrics

| Category | Metric | Target | Measurement |
|----------|--------|--------|-------------|
| **Data Quality** | Accuracy | 99%+ | Audit samples |
| | Completeness | 95%+ | Field coverage |
| | Freshness | <1 hour | Sync lag |
| **Import System** | Format coverage | 8+ types | Supported formats |
| | Extraction accuracy | 90%+ | Verified samples |
| | Processing time | <60 sec | Avg per document |
| | Auto-link rate | 80%+ | No manual matching |
| **System Performance** | Query response | <500ms | P95 latency |
| | Uptime | 99.9% | Monthly availability |
| | Concurrent users | 50+ | Load testing |
| **User Adoption** | Daily active users | 80%+ of team | Analytics |
| | Import utilization | 20+ docs/week | Upload tracking |
| | Manual entry reduction | 70% decrease | Time tracking |

### 13.2 Business Impact Metrics

| Metric | Baseline | 6-Month Target | 12-Month Target |
|--------|----------|----------------|-----------------|
| Data entry time | Hours/day | -70% | -90% |
| Decision cycle time | 2-3 days | <1 day | <4 hours |
| Stockout incidents | Variable | -50% | -80% |
| Procurement savings | - | 3% | 7% |
| Order fulfillment rate | Variable | 95% | 98% |

### 13.3 Phase 2 Metrics (Hugo)

| Metric | Target |
|--------|--------|
| Query accuracy | 95%+ correct |
| Alert precision | 90%+ actionable |
| Recommendation adoption | 70%+ accepted |
| Time to insight | <30 seconds |
| User satisfaction | NPS 50+ |

---

## 14. Technical Requirements

### 14.1 Non-Functional Requirements

| Requirement | Specification |
|-------------|---------------|
| **Availability** | 99.9% uptime |
| **Scalability** | 100K+ records, 100+ concurrent users |
| **Response Time** | <500ms for queries, <60s for imports |
| **Security** | SOC 2, encrypted at rest and transit |
| **Backup** | Daily full, 15-min incremental |
| **Recovery** | RPO: 15 min, RTO: 4 hours |

### 14.2 Integration Requirements

| System | Direction | Method |
|--------|-----------|--------|
| Email (Gmail/Outlook) | Inbound | IMAP / API |
| Cloud Storage | Bidirectional | S3 / GCS API |
| Accounting | Outbound | REST API / Webhook |
| Shipping Carriers | Inbound | Webhook |
| Customer Portal | Outbound | REST API |

### 14.3 AI Service Requirements

| Service | Purpose | Fallback |
|---------|---------|----------|
| Claude / GPT-4 | Document extraction, reasoning | Rule-based parser |
| Vision API | Image/PDF OCR | Tesseract OCR |
| Embeddings | Entity matching | Fuzzy string match |

---

## 15. Implementation Roadmap

### 15.1 Phase 1 Milestones

```
WEEK 1-2: Foundation
├── Set up Supabase/Firebase project
├── Implement core schema
├── Basic CRUD APIs
└── Authentication setup

WEEK 3-4: Import System MVP
├── File upload infrastructure
├── CSV/Excel parser
├── PDF text extraction
├── Basic extraction templates

WEEK 5-6: Core Modules
├── Materials management UI
├── Inventory tracking
├── Basic reporting
└── Real-time sync

WEEK 7-8: Advanced Import
├── AI-powered extraction (Claude/GPT)
├── Email parsing
├── Image OCR
├── Entity linking

WEEK 9-10: Procurement & Sales
├── Purchase order management
├── Sales order tracking
├── Supplier management
└── Event capture

WEEK 11-12: Polish & Launch
├── Dashboard views
├── Alert system
├── Documentation
└── User training
```

### 15.2 Phase 2 Preview

```
MONTH 4-5: Hugo Foundation
├── LLM integration
├── Query interface
├── Context assembly
└── Basic Q&A

MONTH 6-7: Hugo Intelligence
├── Proactive alerts
├── Recommendation engine
├── Optimization suggestions
└── Natural language reports
```

---

## Appendix: Data Dictionary

### A.1 Status Values

| Entity | Status | Description |
|--------|--------|-------------|
| Material | active | Available for use |
| | blocked | Cannot be used (quality, recall) |
| | discontinued | No longer available from suppliers |
| | phasing_out | Active but being replaced |
| Purchase Order | draft | Not yet sent |
| | sent | Sent to supplier |
| | confirmed | Supplier confirmed |
| | partial | Partially received |
| | received | Fully received |
| | cancelled | Cancelled |
| Sales Order | pending | Received, not confirmed |
| | confirmed | Accepted, scheduled |
| | in_production | Being built |
| | shipped | Dispatched |
| | completed | Delivered |
| Document | pending | Awaiting processing |
| | processing | Being extracted |
| | processed | Extraction complete |
| | failed | Extraction failed |

### A.2 Event Types

| Type | Severity | Description |
|------|----------|-------------|
| delay | warning | Delivery date pushed |
| price_change | info | Supplier price update |
| quality_alert | critical | Quality issue detected |
| discontinuation | warning | Part being discontinued |
| partial_shipment | info | Split delivery |
| early_shipment | info | Ahead of schedule |
| discount | info | Promotional pricing |
| proposal | info | New product/capability |
| contract_amendment | warning | Terms modification |

### A.3 Import Templates

| Template | Detects | Extracts |
|----------|---------|----------|
| spec_sheet | BOM, assembly docs | Products, BOM items, notes |
| supplier_email | Supplier communications | Events, dates, references |
| price_list | Pricing documents | Supplier-material prices |
| invoice | Invoices, receipts | Line items, totals |
| packing_slip | Shipping documents | Quantities, tracking |
| inventory_export | Stock reports | Location, quantities |
| order_export | Order data | Order lines, dates |

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2025 | Product Team | Initial PRD |
| 2.0 | Dec 2025 | Product Team | Added Firebase/Supabase, flexible schema, comprehensive import system |

---

*This PRD defines the foundation for Voltway's AI-Native ERP. The system is designed to be flexible, accepting any data format and adapting to evolving business needs. Phase 1 delivers immediate value through unified data and intelligent import. Phase 2 (Hugo) transforms this data foundation into an AI-powered decision engine.*
