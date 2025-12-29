# 🏗️ VOLTWAY ERP - System Architecture Visual Guide

> **See how everything connects**

---

## 🎯 The Big Picture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          VOLTWAY ERP SYSTEM                              │
│                     AI-Powered Procurement Platform                      │
└─────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE LAYER                            │
│                        (What you see and interact with)                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📊 Dashboard        📦 Inventory        🛒 Procurement                 │
│  📈 Sales Orders     🔧 Materials        👥 Suppliers                   │
│  ⚙️  Dispatch        📅 Events           🤖 Hugo AI                     │
│                                                                          │
│  Built with: Next.js 16 + React 19 + TailwindCSS 4                     │
└─────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                       APPLICATION LOGIC LAYER                            │
│                        (How the app processes data)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🔗 Custom React Hooks                  📐 Business Logic               │
│  ├─ useMaterials()                      ├─ Calculate stock status       │
│  ├─ useStockLevels()                    ├─ Determine reorder needs     │
│  ├─ useMaterialOrders()                 ├─ Validate order quantities   │
│  ├─ useSalesOrders()                    └─ Generate alerts              │
│  ├─ useSuppliers()                                                      │
│  └─ useDispatchParameters()                                             │
│                                                                          │
│  Built with: TypeScript + Custom Hooks                                  │
└─────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA STORAGE LAYER                               │
│                       (Where all information lives)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         🔥 FIREBASE / FIRESTORE                         │
│                                                                          │
│  📚 Collections:                                                        │
│  ├─ materials                (24 documents)                            │
│  ├─ stock_levels             (24 documents)                            │
│  ├─ material_orders          (~100 documents)                          │
│  ├─ sales_orders             (~50 documents)                           │
│  ├─ suppliers                (10 documents)                            │
│  ├─ dispatch_parameters      (24 documents)                            │
│  └─ [future: events, specs, movements]                                 │
│                                                                          │
│  Features: Real-time sync, Offline support, Scalability                 │
└─────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                         FUTURE AI LAYER                                  │
│                     (Hugo - Procurement AI Agent)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🤖 Hugo AI Agent (Python/Flask Backend)                                │
│  ├─ Natural Language Processing                                         │
│  ├─ LangChain Orchestration                                            │
│  ├─ OpenAI GPT Integration                                             │
│  ├─ Graph Analysis (NetworkX)                                           │
│  └─ Slack Notifications                                                 │
│                                                                          │
│  Status: UI Ready, Backend In Progress                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### **How Information Moves Through the System**

```
┌─────────────┐
│    USER     │  "I want to see the dashboard"
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Browser loads Next.js App                   │
│  URL: / → Renders src/app/page.tsx          │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  React Component Initializes                 │
│  Calls custom hooks:                         │
│  • useMaterials()                            │
│  • useStockLevels()                          │
│  • useMaterialOrders()                       │
│  • useSalesOrders()                          │
│  • useDispatchParameters()                   │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Custom Hooks Query Firebase                 │
│  Example: useMaterials()                     │
│  ├─ Connect to Firestore                     │
│  ├─ Subscribe to 'materials' collection      │
│  └─ Listen for real-time updates             │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Firebase Returns Data                       │
│  [                                           │
│    {part_id: "P304", name: "Motor", ...},   │
│    {part_id: "P312", name: "Battery", ...}, │
│    ...                                       │
│  ]                                           │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  React State Updates                         │
│  useState() hook receives new data           │
│  Triggers component re-render                │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Business Logic Processes Data               │
│  • Calculate stock status (critical/low)     │
│  • Count active stockouts                    │
│  • Compute on-time delivery rate             │
│  • Filter critical alerts                    │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  UI Renders with Processed Data              │
│  • KPI cards with numbers                    │
│  • Charts and graphs                         │
│  • Tables with colored status                │
│  • Alert notifications                       │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│    USER     │  Sees beautiful, real-time dashboard!
└─────────────┘
```

---

## 🔄 Real-Time Update Flow

### **What Happens When Data Changes**

```
Person A's Computer                Person B's Computer
┌──────────────────┐              ┌──────────────────┐
│  Creates a new   │              │  Viewing the     │
│  purchase order  │              │  same page       │
└────────┬─────────┘              └────────┬─────────┘
         │                                 │
         ▼                                 │
┌──────────────────┐                       │
│  Form submits    │                       │
│  data to Firebase│                       │
└────────┬─────────┘                       │
         │                                 │
         ▼                                 │
    ┌────────────┐                         │
    │  FIREBASE  │                         │
    │  Firestore │                         │
    └────┬───┬───┘                         │
         │   │                             │
         │   └─────────────────────────────┘
         │              Broadcasts change
         ▼                               ▼
┌──────────────────┐              ┌──────────────────┐
│  Person A sees   │              │  Person B sees   │
│  confirmation    │              │  new order appear│
└──────────────────┘              └──────────────────┘

All in < 1 second! ⚡
```

---

## 🗄️ Database Schema Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                    FIRESTORE DATABASE                        │
└─────────────────────────────────────────────────────────────┘

📚 materials                    📚 stock_levels
┌─────────────────────┐         ┌──────────────────────┐
│ P304                │────────▶│ P304-WH1             │
│ ├─ part_name        │         │ ├─ part_id: "P304"   │
│ ├─ part_type        │         │ ├─ location: "WH1"   │
│ ├─ used_in_models   │         │ ├─ quantity: 108     │
│ ├─ weight           │         │ ├─ reserved: 20      │
│ └─ status           │         │ └─ blocked: 0        │
└─────────────────────┘         └──────────────────────┘
         │                               
         │                      📚 material_orders
         │                      ┌──────────────────────┐
         └─────────────────────▶│ O5000                │
                                │ ├─ part_id: "P304"   │
                                │ ├─ supplier_id       │
                                │ ├─ quantity: 100     │
                                │ ├─ status            │
                                │ └─ expected_date     │
                                └──────────────────────┘

📚 suppliers                    📚 dispatch_parameters
┌─────────────────────┐         ┌──────────────────────┐
│ SupA                │         │ P304-params          │
│ ├─ name             │────────▶│ ├─ part_id: "P304"   │
│ ├─ email            │         │ ├─ min_stock: 50     │
│ ├─ reliability      │         │ ├─ reorder_point: 100│
│ └─ lead_time        │         │ └─ reorder_qty: 200  │
└─────────────────────┘         └──────────────────────┘

📚 sales_orders
┌─────────────────────┐
│ SO-2024-12-001      │
│ ├─ model: "S1"      │
│ ├─ version: "V2"    │
│ ├─ quantity: 150    │
│ ├─ order_type       │
│ └─ requested_date   │
└─────────────────────┘
```

---

## 🎨 Frontend Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      src/app/                               │
│                  (Next.js App Router)                       │
└────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   page.tsx          inventory/page.tsx  procurement/page.tsx
   (Dashboard)       (Stock Tracking)    (Purchase Orders)
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
              ┌────────────────────────┐
              │  Components Library    │
              ├────────────────────────┤
              │  Layout/               │
              │  ├─ Header.tsx         │
              │  └─ Sidebar.tsx        │
              │                        │
              │  UI/                   │
              │  └─ Modal.tsx          │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Hooks & Utilities     │
              ├────────────────────────┤
              │  lib/                  │
              │  ├─ firebase.ts        │
              │  ├─ useFirestore.ts    │
              │  ├─ data.ts            │
              │  └─ DataProvider.tsx   │
              └────────────────────────┘
```

---

## 🔌 Hook Architecture

```
Component (e.g., Dashboard)
         │
         │ const { data, loading, error } = useMaterials();
         │
         ▼
┌─────────────────────┐
│  useMaterials()     │  Custom Hook
├─────────────────────┤
│  1. useState()      │  Initialize state
│  2. useEffect()     │  Run on mount
│  3. onSnapshot()    │  Subscribe to Firebase
│  4. return data     │  Provide to component
└─────────────────────┘
         │
         │ Real-time listener
         │
         ▼
    Firebase Firestore
    'materials' collection
    
When data changes in Firebase:
    ▼
onSnapshot() callback fires
    ▼
setState() updates component
    ▼
Component re-renders with new data
```

---

## 🎭 Component Lifecycle

```
1. USER NAVIGATES TO PAGE
   └─▶ Next.js loads page.tsx

2. COMPONENT MOUNTS
   └─▶ React calls component function
       └─▶ Hooks initialize (useState, useEffect)

3. DATA FETCHING STARTS
   └─▶ useFirestore hooks subscribe to Firebase
       └─▶ Loading state = true

4. FIREBASE RESPONDS
   └─▶ Data arrives from Firestore
       └─▶ useState updates with data
       └─▶ Loading state = false

5. COMPONENT RENDERS
   └─▶ UI displays with data
       └─▶ Charts, tables, cards visible

6. USER INTERACTION
   └─▶ User clicks button, fills form
       └─▶ Event handler fires
       └─▶ Data sent to Firebase

7. REAL-TIME UPDATE
   └─▶ Firebase broadcasts change
       └─▶ onSnapshot() receives update
       └─▶ State updates automatically
       └─▶ UI re-renders

8. USER NAVIGATES AWAY
   └─▶ Component unmounts
       └─▶ Firebase listeners unsubscribe
       └─▶ Cleanup complete
```

---

## 🔐 Security Architecture (Future)

```
┌─────────────────────────────────────────────┐
│           CURRENT (Demo Mode)                │
├─────────────────────────────────────────────┤
│  • Open access (no login)                   │
│  • Firebase rules: public read/write        │
│  • Credentials in .env.local                │
└─────────────────────────────────────────────┘
                    │
                    │ Future enhancement
                    ▼
┌─────────────────────────────────────────────┐
│        FUTURE (Production Mode)              │
├─────────────────────────────────────────────┤
│  1. USER AUTHENTICATION                     │
│     └─▶ Firebase Auth (email/password)     │
│                                             │
│  2. ROLE-BASED ACCESS                       │
│     ├─▶ Admin: Full access                 │
│     ├─▶ Manager: Create/edit               │
│     └─▶ Viewer: Read only                  │
│                                             │
│  3. FIRESTORE RULES                         │
│     └─▶ Check auth.uid                     │
│     └─▶ Validate role                      │
│                                             │
│  4. AUDIT LOGGING                           │
│     └─▶ Track who changed what             │
└─────────────────────────────────────────────┘
```

---

## 🚀 Deployment Pipeline

```
┌──────────────┐
│ Local Dev    │  bun run dev → http://localhost:3000
└──────┬───────┘
       │ git push
       ▼
┌──────────────┐
│ GitHub Repo  │  Code repository
└──────┬───────┘
       │ Connected to...
       ▼
┌──────────────┐
│ Vercel       │  Automatic deployment
└──────┬───────┘
       │ Builds & deploys
       ▼
┌──────────────┐
│ Production   │  https://voltway-erp.vercel.app
└──────────────┘

Connected to:
    Firebase (Database)
    OpenAI (AI - future)
    Slack (Notifications - future)
```

---

## 📱 Responsive Design Architecture

```
┌─────────────────────────────────────────────┐
│           MOBILE (< 640px)                   │
├─────────────────────────────────────────────┤
│  📱 Single column layout                    │
│  ├─ Hamburger menu                          │
│  ├─ Stacked cards                           │
│  └─ Scrollable tables                       │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         TABLET (640px - 1024px)              │
├─────────────────────────────────────────────┤
│  📱 Two column layout                       │
│  ├─ Collapsible sidebar                     │
│  ├─ Grid cards (2 cols)                     │
│  └─ Responsive tables                       │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│          DESKTOP (> 1024px)                  │
├─────────────────────────────────────────────┤
│  🖥️ Full layout with sidebar               │
│  ├─ Fixed sidebar navigation                │
│  ├─ Grid cards (4 cols)                     │
│  ├─ Full-width tables                       │
│  └─ Advanced visualizations                 │
└─────────────────────────────────────────────┘

Powered by: Tailwind CSS breakpoints
```

---

## 🔄 State Management Flow

```
┌────────────────────────────────────────┐
│      Component Local State              │
│      (useState)                         │
├────────────────────────────────────────┤
│  • Form inputs                          │
│  • Modal open/close                     │
│  • Temporary UI state                   │
└────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│      Firebase Realtime State            │
│      (Firestore listeners)              │
├────────────────────────────────────────┤
│  • Materials data                       │
│  • Stock levels                         │
│  • Orders                               │
│  • Suppliers                            │
└────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│      Computed State                     │
│      (Derived from Firebase data)       │
├────────────────────────────────────────┤
│  • KPIs (calculated)                    │
│  • Stock status (critical/low/healthy)  │
│  • Alerts (filtered)                    │
│  • Charts data (processed)              │
└────────────────────────────────────────┘

No Redux needed! 
Firebase + hooks = Simple state management
```

---

## 🎯 Feature Dependency Map

```
                    CORE FOUNDATION
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Firebase        Next.js App      Tailwind CSS
   Database          Router            Styling
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                   DATA LAYER
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Materials        Stock Levels      Suppliers
   Collection       Collection        Collection
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                  BUSINESS LOGIC
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Stock Status    Reorder Logic     Alerts
   Calculation     Automation        System
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
                  USER INTERFACE
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Dashboard       Inventory         Orders
   Page            Page              Page
```

---

## 🧩 Integration Points

```
┌─────────────────────────────────────────────┐
│         VOLTWAY ERP (Current)                │
└─────────────────────────────────────────────┘
                    │
                    │ Integrated with:
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Firebase     Material     Dark Mode
   Firestore    Symbols      Support
                   │
                   │ Future integrations:
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   OpenAI API   Slack      Email
   (Hugo AI)    Notifs     Parser
```

---

## 📊 Performance Architecture

```
┌────────────────────────────────────────┐
│      OPTIMIZATION STRATEGIES            │
├────────────────────────────────────────┤
│                                        │
│  1. Code Splitting                     │
│     └─▶ Next.js automatically splits   │
│         each page into separate chunks │
│                                        │
│  2. Lazy Loading                       │
│     └─▶ Components load on demand      │
│                                        │
│  3. Firebase Indexing                  │
│     └─▶ Fast queries on indexed fields │
│                                        │
│  4. Real-time Subscriptions            │
│     └─▶ Only listen to needed data     │
│                                        │
│  5. Memoization                        │
│     └─▶ useMemo() for expensive calcs  │
│                                        │
│  6. Debouncing                         │
│     └─▶ Search inputs delay queries    │
│                                        │
└────────────────────────────────────────┘

Result: Fast, responsive app even with large datasets!
```

---

## 🎨 Design System Hierarchy

```
┌─────────────────────────────────────┐
│        DESIGN TOKENS                 │
├─────────────────────────────────────┤
│  Colors:                             │
│  • Primary: Indigo                   │
│  • Success: Green                    │
│  • Warning: Yellow                   │
│  • Danger: Red                       │
│  • Neutral: Gray/Slate               │
│                                      │
│  Typography:                         │
│  • System Font Stack                 │
│  • Material Symbols Icons            │
│                                      │
│  Spacing:                            │
│  • Tailwind scale (0.25rem units)    │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│       BASE COMPONENTS                │
├─────────────────────────────────────┤
│  • Button                            │
│  • Input                             │
│  • Card                              │
│  • Table                             │
│  • Modal                             │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│     COMPOSITE COMPONENTS             │
├─────────────────────────────────────┤
│  • KPI Card                          │
│  • Data Table                        │
│  • Alert Box                         │
│  • Progress Bar                      │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│        PAGE LAYOUTS                  │
├─────────────────────────────────────┤
│  • Dashboard                         │
│  • Inventory                         │
│  • Orders                            │
└─────────────────────────────────────┘
```

---

## 🔍 Debugging Architecture

```
Problem Occurs
      │
      ▼
┌──────────────────┐
│ Browser Console  │  F12 → Console tab
│ Check for errors │  Red messages = errors
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ React DevTools   │  Inspect component state
│ Check state      │  Props, hooks, context
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Network Tab      │  Check Firebase calls
│ Check API calls  │  Response times, errors
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Firebase Console │  Check database directly
│ Verify data      │  Collections, documents
└────────┬─────────┘
         │
         ▼
   Problem Found!
   └─▶ Fix code → Test → Deploy
```

---

## 🌐 Full System Map

```
┌───────────────────────────────────────────────────────────────┐
│                    USER'S JOURNEY                              │
│                                                                │
│  1. Opens browser → types URL                                 │
│  2. Next.js serves HTML + JavaScript                          │
│  3. React app initializes                                     │
│  4. Firebase hooks fetch data                                 │
│  5. UI renders with live data                                 │
│  6. User creates order                                        │
│  7. Data saved to Firebase                                    │
│  8. Real-time update propagates                               │
│  9. All connected users see change                            │
│  10. System generates alerts                                  │
│  11. Hugo AI analyzes (future)                                │
│  12. Recommendation shown to user                             │
│  13. User makes informed decision                             │
│  14. Production runs smoothly! ✅                             │
└───────────────────────────────────────────────────────────────┘
```

---

**Understanding this architecture means you understand the entire system!** 🎉

---

**Last Updated**: December 29, 2024  
**Version**: 1.0
