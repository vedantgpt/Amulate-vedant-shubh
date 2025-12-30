# Voltway ERP - Till The Point Documentation

## What Is This?

**Voltway ERP** is an inventory and procurement management system for Voltway Electric Scooters. It tracks parts, orders, suppliers, and sales in real-time using Firebase.

## Core Functionality

### 1. Inventory Management
- Track stock levels for all parts (motors, batteries, wheels, etc.)
- Real-time quantity updates
- Color-coded status: 🔴 Critical | 🟡 Low | 🟢 Healthy
- Location tracking (warehouse management)

### 2. Procurement (Purchase Orders)
- Create orders to suppliers
- Track order status: Pending → Ordered → Delivered
- Monitor expected vs actual delivery dates
- Supplier selection and comparison

### 3. Sales Orders
- Manage customer orders for scooter models (S1, S2, S3)
- Different channels: Webshop, Fleet contracts
- Quantity and delivery date tracking

### 4. Supplier Management
- Supplier catalog with contact info
- Reliability ratings (0-1 scale)
- Lead times and pricing per part
- Minimum order quantities

### 5. Materials Catalog
- Complete parts database
- Part specifications (weight, type, etc.)
- Bill of materials (which parts need which components)
- Usage tracking (which scooter models use each part)

### 6. Dispatch Parameters
- Automated reorder rules per part
- Set minimum stock levels
- Define reorder quantities
- Schedule review intervals

### 7. Real-Time Dashboard
- Key metrics at a glance
- Daily build rate
- Active stockouts count
- On-time delivery percentage
- Critical alerts

## Tech Stack

```
Frontend:  Next.js 16 + React 19 + TypeScript + Tailwind CSS
Database:  Firebase Firestore (cloud NoSQL)
Runtime:   Bun (package manager + runtime)
Hosting:   Vercel (production deployment)
```

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Setup Firebase credentials
cp env.example .env.local
# Edit .env.local with your Firebase keys

# 3. Run development server
bun run dev

# 4. Open browser
http://localhost:3000
```

## Database Structure

```
Firestore Collections:
├── materials              (parts catalog)
├── stock_levels           (inventory quantities)
├── material_orders        (purchase orders)
├── sales_orders           (customer orders)
├── suppliers              (supplier info)
└── dispatch_parameters    (reorder rules)
```

## Key Features

✅ Real-time data sync across all users  
✅ Automatic low stock alerts  
✅ CSV data import (Admin page)  
✅ Mobile-responsive design  
✅ Dark mode support  
✅ Search and filtering  

## File Structure

```
voltway-erp/
├── src/
│   ├── app/                    # Pages
│   │   ├── page.tsx            # Dashboard
│   │   ├── inventory/          # Stock tracking
│   │   ├── procurement/        # Purchase orders
│   │   ├── sales/              # Sales orders
│   │   ├── suppliers/          # Supplier management
│   │   ├── materials/          # Parts catalog
│   │   ├── dispatch/           # Reorder rules
│   │   ├── admin/              # Database seeding
│   │   └── api/                # API routes
│   │
│   ├── lib/                    # Utilities
│   │   ├── firebase.ts         # Firebase config
│   │   ├── useFirestore.ts     # Database hooks
│   │   └── data.ts             # Sample data
│   │
│   └── components/             # UI components
│       ├── layout/             # Header, Sidebar
│       └── ui/                 # Modal, etc.
│
├── public/                     # Static files
├── .env.local                  # Firebase credentials (secret)
└── package.json                # Dependencies
```

## How To Use

### 1. Dashboard (`/`)
View overview metrics, critical alerts, production capacity

### 2. Manage Inventory (`/inventory`)
- See all parts with stock levels
- Identify low/critical stock items
- Check part locations

### 3. Create Orders (`/procurement`)
- Click "New Order"
- Select part and supplier
- Enter quantity and dates
- Track delivery status

### 4. View Sales (`/sales`)
- See customer orders
- Filter by model or order type
- Monitor delivery dates

### 5. Manage Suppliers (`/suppliers`)
- View reliability ratings
- Compare lead times and prices
- Track supplier performance

### 6. Set Reorder Rules (`/dispatch`)
- Define minimum stock levels
- Set automatic reorder quantities
- Configure review intervals

### 7. Import Data (`/admin`)
- Upload CSV files for bulk import
- Seed database with sample data
- Reset collections if needed

## Key Concepts

**Part Types:**
- **Assembly**: Composed of multiple components (e.g., motor unit)
- **Component**: Individual parts (e.g., screws, batteries)

**Stock Status:**
- **Critical**: Below 50% of minimum stock
- **Low**: Below minimum stock level
- **Healthy**: Above minimum stock level

**Order Status:**
- **Pending**: Created but not yet ordered
- **Ordered**: Sent to supplier, awaiting delivery
- **Delivered**: Received in warehouse

**Order Types:**
- **Webshop**: Individual customer orders (1-5 units)
- **Fleet Framework**: Long-term contracts (100+ units)
- **Fleet Spot**: One-time bulk orders

## Data Flow

```
User Action → Frontend → Firebase → Real-time Sync → All Connected Users

Example:
1. User creates purchase order
2. Data saved to Firestore
3. Firebase broadcasts change
4. All dashboards update instantly
```

## Environment Variables

Required in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Production Build

```bash
# Build for production
bun run build

# Preview production build
bun run start

# Deploy to Vercel
vercel --prod
```

## Common Tasks

**Add a new part:**
1. Go to `/materials`
2. Click "Add Material"
3. Fill in details (ID, name, type, min stock)
4. Save

**Create purchase order:**
1. Go to `/procurement`
2. Click "New Order"
3. Select part and supplier
4. Enter quantity and dates
5. Submit

**Check low stock:**
1. Dashboard shows critical alerts
2. Or go to `/inventory`
3. Filter by status: "Low" or "Critical"

**Import data:**
1. Go to `/admin`
2. Click "Upload CSV"
3. Select file (materials, orders, sales, etc.)
4. Confirm import

## Troubleshooting

**No data showing?**
→ Go to `/admin` and seed database

**Firebase errors?**
→ Check `.env.local` credentials

**Build errors?**
→ Run `bun install` again

**Port already in use?**
→ `npx kill-port 3000` then restart

## Project Highlights

🏆 **1st Place** - Dryft AI Challenge @ HackTech 2025 (Caltech)  
⚡ Real-time updates with Firebase  
📱 Mobile-responsive design  
🎨 Modern UI with Tailwind CSS  
🔥 Built with Next.js 16 + React 19  

## Support

For issues, check:
- `README.md` - Setup instructions
- `PROJECT_SUMMARY.md` - Detailed documentation
- `ARCHITECTURE.md` - System architecture
- `QUICK_REFERENCE.md` - Cheat sheet

---

**Last Updated:** December 29, 2024  
**Version:** 1.0  
**Team:** Vedant & Shubh (Amulate)
