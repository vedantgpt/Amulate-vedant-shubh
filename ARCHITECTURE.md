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
│                        🤖 HUGO AI LAYER                                  │
│                   (Intelligent Procurement Copilot)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🧠 Hugo AI Agent (LangChain + MegaLLM)                                 │
│  ├─ Natural Language Processing                                         │
│  ├─ LangChain Orchestration                                            │
│  ├─ MegaLLM (OpenAI-compatible GPT)                                    │
│  ├─ OCR Document Processing (OCR.space)                                │
│  ├─ Email Automation (Resend API)                                      │
│  └─ PDF Export (jsPDF)                                                  │
│                                                                          │
│  Status: ✅ LIVE - Fully Integrated                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Hugo AI Architecture

### **AI Processing Pipeline**

```
┌─────────────┐
│    USER     │  "What parts are running low?"
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Hugo AI Frontend (src/app/hugo/page.tsx)   │
│  ├─ Chat interface with message history     │
│  ├─ File upload (PDF/Image)                 │
│  ├─ Document attachment handling            │
│  └─ PDF export functionality                │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Hugo API Route (/api/hugo)                  │
│  ├─ Receive message + file                  │
│  ├─ Process file with OCR (if uploaded)     │
│  └─ Build context with database snapshot    │
└──────┬──────────────────────────────────────┘
       │
       ├─────────────────────────────────────────┐
       ▼                                         ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│  OCR.space API          │       │  Firebase Firestore     │
│  ├─ PDF text extraction │       │  ├─ materials           │
│  ├─ Image OCR           │       │  ├─ stock_levels        │
│  └─ Multi-page support  │       │  └─ suppliers           │
└─────────────────────────┘       └─────────────────────────┘
       │                                         │
       └─────────────────┬───────────────────────┘
                         ▼
┌─────────────────────────────────────────────┐
│  LangChain + MegaLLM                         │
│  ├─ System prompt with ERP context          │
│  ├─ Conversation history (last 6 msgs)      │
│  ├─ Database context injection              │
│  ├─ File content (OCR extracted text)       │
│  └─ Action block parsing (JSON)             │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Response Processing                         │
│  ├─ Parse action blocks (if any)            │
│  ├─ Execute database operations             │
│  ├─ Send emails (if requested)              │
│  └─ Return formatted response               │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│    USER     │  Sees AI response with insights!
└─────────────┘
```

---

## 🔄 Hugo AI Action Types

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       HUGO AI CAPABILITIES                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📊 QUERY ACTIONS                        🔧 DATABASE ACTIONS            │
│  ├─ Stock level queries                  ├─ add (new records)           │
│  ├─ Supplier info lookup                 ├─ update (modify records)     │
│  ├─ Order status check                   ├─ delete (remove records)     │
│  └─ Recommendations                      ├─ update_stock                │
│                                          ├─ mark_delivered              │
│  📄 DOCUMENT PROCESSING                  ├─ update_supplier             │
│  ├─ PDF OCR extraction                   └─ update_all_supplier_emails  │
│  ├─ Image text recognition                                              │
│  └─ Multi-page document support          📧 EMAIL ACTIONS               │
│                                          ├─ send_email                  │
│  📑 EXPORT ACTIONS                       └─ Reorder requests            │
│  ├─ Full conversation PDF                                               │
│  └─ Single message report                                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📄 Document Processing Flow

### **PDF/Image OCR Pipeline**

```
User uploads file
       │
       ▼
┌─────────────────────────────────────────────┐
│  Frontend File Handler                       │
│  ├─ Validate file type (PDF/JPG/PNG)        │
│  ├─ Check file size (< 5MB)                 │
│  ├─ Convert to base64                       │
│  └─ Send with message to API                │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  API Route Processing                        │
│  ├─ Detect file type                        │
│  │   ├─ PDF → OCR.space (filetype=PDF)     │
│  │   └─ Image → OCR.space (base64Image)    │
│  ├─ Send to OCR.space API                   │
│  └─ Extract text from all pages             │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  OCR.space API                               │
│  ├─ Engine 2 (more accurate)                │
│  ├─ Table detection enabled                 │
│  ├─ Orientation detection                   │
│  └─ Returns ParsedResults[]                 │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Text Processing                             │
│  ├─ Combine text from all pages             │
│  ├─ Format with page separators             │
│  ├─ Limit to 12,000 characters              │
│  └─ Inject into LLM context                 │
└──────┬──────────────────────────────────────┘
       │
       ▼
Hugo AI analyzes extracted text
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
│ ├─ supplier_id      │────────▶│ ├─ part_id: "P304"   │
│ ├─ supplier_name    │         │ ├─ min_stock: 50     │
│ ├─ email            │         │ ├─ reorder_point: 100│
│ ├─ phone            │         │ └─ reorder_qty: 200  │
│ ├─ reliability_score│         └──────────────────────┘
│ └─ lead_time_days   │
└─────────────────────┘

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
        │                  ▼                  │
        │            hugo/page.tsx            │
        │            (AI Copilot)             │
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
              │                        │
              │  Theme/                │
              │  ├─ ThemeProvider.tsx  │
              │  └─ ThemeToggle.tsx    │
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

## 🔌 API Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      src/app/api/                           │
│                   (Next.js API Routes)                      │
└────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   hugo/route.ts     hugo/actions/route.ts  hugo/email/route.ts
   (AI Chat API)     (Database Actions)     (Supplier Emails)
        │                  │                  │
        ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ LangChain +     │ │ Firebase Admin  │ │ Resend API      │
│ MegaLLM         │ │ SDK             │ │                 │
│ OCR.space API   │ │ CRUD Operations │ │ Email Delivery  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
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
│ Vercel /     │  Automatic deployment
│ Netlify      │
└──────┬───────┘
       │ Builds & deploys
       ▼
┌──────────────┐
│ Production   │  https://voltway-erp.vercel.app
└──────────────┘

Connected Services:
    🔥 Firebase (Database)
    🤖 MegaLLM (AI/LLM)
    📄 OCR.space (Document Processing)
    📧 Resend (Email)
```

---

## 🧩 Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                    VOLTWAY ERP INTEGRATIONS                  │
└─────────────────────────────────────────────────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    ▼                      ▼                      ▼
┌────────────┐      ┌────────────┐        ┌────────────┐
│ Firebase   │      │ MegaLLM    │        │ OCR.space  │
│ Firestore  │      │ (LLM API)  │        │ (OCR API)  │
├────────────┤      ├────────────┤        ├────────────┤
│ Database   │      │ AI Chat    │        │ PDF OCR    │
│ Real-time  │      │ 120B Model │        │ Image OCR  │
│ Scalable   │      │ LangChain  │        │ Free Tier  │
└────────────┘      └────────────┘        └────────────┘
    │                      │                      │
    └──────────────────────┼──────────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    ▼                      ▼                      ▼
┌────────────┐      ┌────────────┐        ┌────────────┐
│ Resend     │      │ jsPDF      │        │ Theme      │
│ (Email)    │      │ (Export)   │        │ (Light/Dark│
├────────────┤      ├────────────┤        ├────────────┤
│ Supplier   │      │ PDF Export │        │ localStorage│
│ Emails     │      │ Reports    │        │ Persisted  │
│ Reorders   │      │ Formatted  │        │ Toggle     │
└────────────┘      └────────────┘        └────────────┘
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
│  6. Theme Persistence                  │
│     └─▶ localStorage for instant load  │
│                                        │
│  7. OCR API Caching                    │
│     └─▶ Efficient document processing  │
│                                        │
└────────────────────────────────────────┘

Result: Fast, responsive app with AI capabilities!
```

---

## 🌐 Full System Map

```
┌───────────────────────────────────────────────────────────────┐
│                    USER'S JOURNEY                              │
│                                                                │
│  1. Opens browser → types URL                                 │
│  2. Next.js serves HTML + JavaScript                          │
│  3. React app initializes with theme preference               │
│  4. Firebase hooks fetch data                                 │
│  5. UI renders with live data                                 │
│  6. User navigates to Hugo AI                                 │
│  7. Uploads PDF document                                      │
│  8. OCR.space extracts text                                   │
│  9. LangChain + MegaLLM processes query                       │
│  10. AI provides insights from document                       │
│  11. User asks to reorder parts                               │
│  12. Hugo sends email to supplier                             │
│  13. Database updated automatically                           │
│  14. All connected users see changes                          │
│  15. Production runs smoothly! ✅                             │
└───────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16.1 | React framework with App Router |
| **UI Library** | React 19 | Component-based UI |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Language** | TypeScript 5 | Type-safe JavaScript |
| **Database** | Firebase Firestore | Real-time NoSQL database |
| **AI/LLM** | MegaLLM + LangChain | Conversational AI |
| **OCR** | OCR.space API | Document text extraction |
| **PDF Export** | jsPDF | Generate PDF reports |
| **Email** | Resend API | Supplier communications |
| **Theme** | Custom Context | Light/Dark mode toggle |

---

**Understanding this architecture means you understand the entire system!** 🎉

---

**Last Updated**: December 30, 2024  
**Version**: 2.0 (Hugo AI + OCR Integration)
