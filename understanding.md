# Swerve - Comprehensive Project Documentation

## 📋 Project Overview

**Swerve** is an **Agentic AI-powered Procurement Management System** designed specifically for **Voltway Electric Scooters**. It won **1st Place at the Dryft AI Challenge @ HackTech 2025 (Caltech's hackathon)**.

The system provides an intelligent procurement workspace that combines:
- **Operational dashboards** for real-time inventory, sales, suppliers, and orders monitoring
- **Automation triggers** for low stock alerts, blocked parts, and lead-time risks
- **AI-assisted workflows** using LangChain-powered agents for intelligent decision-making

### Key Features
- Inventory management and health monitoring
- Purchase order tracking
- Sales analysis and forecasting
- Supplier reliability analysis
- Automated low-stock and reordering workflows
- Interactive supply chain map visualization
- Slack notifications integration
- Hugo AI Assistant (AI-powered chatbot for procurement queries)

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | ^18.3.1 | Core UI framework |
| **Vite** | ^6.2.2 | Build tool and dev server |
| **React Router DOM** | ^6.26.2 | Client-side routing |
| **Tailwind CSS** | ^3.4.17 | Utility-first CSS framework |
| **Recharts** | ^2.15.3 | Chart and data visualization |
| **Lucide React** | ^0.445.0 | Icon library |
| **MapLibre GL** | ^5.4.0 | Interactive map visualization |
| **React Map GL** | ^8.0.4 | React wrapper for Mapbox/MapLibre |
| **Deck.gl** | ^9.1.11 | WebGL-powered data visualization layers |
| **Firebase** | ^11.6.1 | Authentication, Firestore, Storage |
| **Axios** | ^1.7.7 | HTTP client |

### Backend
| Technology | Purpose |
|------------|---------|
| **Python** | Backend programming language |
| **Flask** | Web framework for REST API |
| **Flask-CORS** | Cross-origin resource sharing |
| **Firebase Admin SDK** | Firebase database access |
| **OpenAI API** | GPT models for AI assistant |
| **LangChain** | AI agent orchestration |
| **Slack SDK** | Slack notifications integration |
| **NetworkX** | Graph data structure and visualization |
| **Pandas** | Data manipulation and analysis |
| **Matplotlib** | Data visualization and graph generation |

### Database & Authentication
| Service | Purpose |
|---------|---------|
| **Firebase Firestore** | NoSQL cloud database |
| **Firebase Authentication** | User authentication |
| **Firebase Storage** | File storage |

---

## 📁 Project Structure

```
Swerve/
├── README.md                    # Main project documentation
├── package.json                 # Root package configuration
├── images/                      # Project images
├── invoices/                    # Sample invoice data
│   ├── orders.json
│   ├── parts.json
│   ├── sales.json
│   └── removeJson.py
│
├── backEnd/                     # Python Flask Backend
│   ├── app.py                   # Main Flask application entry point
│   ├── slack_service.py         # Slack notification service
│   ├── data/                    # JSON data files
│   │   ├── orders.json
│   │   ├── parts.json
│   │   ├── sales_orders.json
│   │   ├── supply.json
│   │   ├── specs.json
│   │   ├── emails/              # Email templates (10 files)
│   │   └── specs/               # Specification files (6 files)
│   │
│   └── hugo/                    # Hugo AI Assistant module
│       ├── __init__.py
│       ├── hugo.py              # Main AI agent orchestration
│       ├── graph.py             # Parts-specs relationship graph
│       ├── part.py              # Part data model class
│       ├── supplier.py          # Supplier data model class
│       ├── order.py             # Order data model class
│       ├── sales.py             # Sales data model class
│       ├── upload_data.py       # Firebase data upload utilities
│       ├── test.py              # Test file
│       ├── basic.json           # Basic graph data
│       ├── critical.json        # Critical parts data
│       └── *.png                # Generated graph visualizations
│
└── frontEnd/                    # React.js Frontend
    ├── index.html               # HTML entry point
    ├── package.json             # Frontend dependencies
    ├── vite.config.js           # Vite configuration
    ├── tailwind.config.js       # Tailwind CSS configuration
    ├── postcss.config.js        # PostCSS configuration
    ├── eslint.config.js         # ESLint configuration
    ├── public/                  # Static assets
    │
    └── src/                     # Source code
        ├── main.jsx             # React entry point
        ├── App.jsx              # Main App component with routing
        ├── App.css              # App styles
        ├── index.css            # Global styles
        ├── firebase.js          # Firebase configuration
        │
        ├── components/          # Reusable UI components (22 files)
        ├── pages/               # Page components (13 files)
        ├── services/            # API services (2 files)
        ├── hooks/               # Custom React hooks (1 file)
        ├── styles/              # Style files
        ├── utils/               # Utility functions
        └── data/                # Static data files
```

---

## 📄 File-by-File Summary

### Backend Files

#### `backEnd/app.py`
**Main Flask Application Entry Point**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Central Flask server that handles all API endpoints |
| **Key Dependencies** | Flask, Firebase Admin SDK, Hugo AI module |
| **Port** | Runs on `localhost:5050` |

**API Endpoints:**
- `GET /api/<collection>/<doc_id>` - Retrieve a document from Firestore
- `PUT/POST /api/<collection>/<doc_id>` - Create or overwrite a document
- `PATCH /api/<collection>/<doc_id>` - Update specific fields in a document
- `DELETE /api/<collection>/<doc_id>` - Delete a document
- `POST /api/chat` - Chat with Hugo AI assistant
- `POST /api/notify-slack` - Send notifications to Slack
- `GET /ping` - Health check endpoint

**Valid Collections:** `sales`, `orders`, `parts`, `supply`

---

#### `backEnd/slack_service.py`
**Slack Notification Service**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Sends messages to Slack using Slack SDK |
| **Key Function** | `post_message(text)` - Posts a message to the configured Slack channel |
| **Configuration** | Requires `SLACK_BOT_TOKEN` and `SLACK_CHANNEL` environment variables |

---

#### `backEnd/hugo/hugo.py`
**Hugo AI Agent - Core Intelligence Engine**

| Aspect | Description |
|--------|-------------|
| **Purpose** | LangChain-powered AI assistant for procurement analysis |
| **Size** | 487 lines |
| **AI Model** | GPT-3.5-turbo for orchestration, GPT-4/GPT-4o for analysis |

**Class: `Hugo`**
- **Initialization:**
  - Connects to Firebase
  - Loads OpenAI API key
  - Initializes Parts, Suppliers, Orders, Sales data models
  - Creates relationship graph summary table

**LangChain Tools (AI Agent Capabilities):**

| Tool | Description |
|------|-------------|
| `check_low_stocks()` | Finds parts with stock below minimum level |
| `find_supplier_for_part(part_id)` | Finds suppliers for a specific part |
| `check_pending_orders()` | Returns all orders with "ordered" status |
| `relationship_evaluation(question)` | Analyzes relationships between parts and specs |
| `inventory_alerts()` | Detects inventory issues (low stock, blocked parts, high usage) |
| `general_questions(question)` | Answers general inventory-related questions |

**Main Method: `chat(query)`**
- Creates a LangChain agent with conversational memory
- Routes queries to appropriate tools
- Returns AI-generated responses with procurement recommendations

---

#### `backEnd/hugo/graph.py`
**Parts-Specs Relationship Graph Generator**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Creates network graphs showing relationships between parts and product specs |
| **Size** | 260 lines |
| **Key Dependencies** | NetworkX, Matplotlib, Pandas |

**Key Functions:**
- `create_graph(db)` - Main function that:
  - Fetches parts and specs from Firebase
  - Creates a NetworkX directed graph
  - Color-codes edges based on stock status (green=good, yellow=medium, orange=low, red=blocked)
  - Generates `specs_parts_graph.png` visualization
  - Creates `parts_summary.csv` with status categories
  - Generates `critical_parts_graph.png` for at-risk parts

---

#### `backEnd/hugo/part.py`
**Part Data Model**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Represents a single part/component in inventory |
| **Size** | 58 lines |

**Properties:**
- `part_id`, `part_name`, `part_type`
- `min_stock`, `reorder_quantity`, `reorder_interval_days`
- `used_in_models`, `weight`, `location`, `quantity`
- `blocked`, `comments`, `successor_part`, `stock_level`

**Methods:**
- `needs_reorder()` - Check if below minimum stock
- `block_part(reason)` / `unblock_part()` - Manage part blocking
- `update_stock(amount)` - Adjust stock level
- `info()` - Return detailed part information

---

#### `backEnd/hugo/supplier.py`
**Supplier Data Model**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Represents a supplier relationship for a specific part |
| **Size** | 13 lines |

**Properties:**
- `supplier_id`, `part_id`
- `price_per_unit`, `lead_time_days`
- `min_order_qty`, `reliability_rating`

---

#### `backEnd/hugo/order.py`
**Order Data Model**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Represents a purchase order |
| **Size** | 14 lines |

**Properties:**
- `order_id`, `part_id`, `quantity_ordered`
- `order_date`, `expected_delivery_date`, `actual_delivered_at`
- `supplier_id`, `status`

---

#### `backEnd/hugo/sales.py`
**Sales Order Data Model**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Represents a sales order for scooter models |
| **Size** | 13 lines |

**Properties:**
- `sales_order_id`, `model`, `version`, `quantity`
- `order_type`, `requested_date`, `created_at`, `accepted_request_date`

---

#### `backEnd/hugo/upload_data.py`
**Firebase Data Upload Utility**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Uploads local JSON data files to Firebase Firestore |
| **Size** | 122 lines |

**Functions:**
- `initialize_firebase()` - Initialize Firebase connection
- `upload_sales_orders(db)` - Upload sales data
- `upload_orders(db)` - Upload orders data
- `upload_parts(db)` - Upload parts data
- `upload_supply(db)` - Upload supply/supplier data
- `upload_specs(db)` - Upload product specifications

---

### Frontend Files

#### `frontEnd/src/App.jsx`
**Main Application Component with Routing**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Defines all application routes |
| **Size** | 41 lines |

**Routes:**
| Path | Component |
|------|-----------|
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Dashboard |
| `/map` | Map (Supply Chain) |
| `/products` | Products |
| `/parts` | Parts |
| `/sales` | Sales |
| `/orders` | Orders |
| `/suppliers` | Suppliers |
| `/analytics` | Analytics |
| `/hugo-ai` | HugoAI |
| `/data-import` | DataImport |
| `/notifications` | Notifications |
| `/settings` | Settings |

---

#### `frontEnd/src/firebase.js`
**Firebase Configuration**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Initializes Firebase services and exports collection references |
| **Size** | 38 lines |

**Exports:**
- `app` - Firebase app instance
- `db` - Firestore database instance
- `auth` - Firebase authentication
- `storage` - Firebase storage
- `salesCollection`, `ordersCollection`, `partsCollection`, `supplyCollection` - Collection references

---

#### `frontEnd/src/services/apiService.js`
**API Service Layer**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Service functions for interacting with the Flask backend |
| **Size** | 168 lines |

**Functions:**
| Function | Description |
|----------|-------------|
| `getDocument(collection, docId)` | Fetch a document from collection |
| `createOrUpdateDocument(collection, docId, data)` | Create or overwrite a document |
| `updateDocumentFields(collection, docId, data)` | Update specific fields |
| `deleteDocument(collection, docId)` | Delete a document |
| `chatWithHugo(query)` | Send a query to Hugo AI |
| `checkPartsUpdateWithHugo(sendToSlack)` | Get parts update and optionally send to Slack |

---

#### `frontEnd/src/services/slackService.js`
**Slack Service (Frontend)**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Send messages to Slack via backend endpoint |
| **Size** | 48 lines |

**Functions:**
- `sendSlackMessage(message)` - Sends message via `/api/notify-slack`
- `formatSlackInventoryAlert(hugoResponse)` - Formats inventory alerts for Slack

---

#### `frontEnd/src/hooks/useFirebaseData.js`
**Custom Firebase Data Hooks**

| Aspect | Description |
|--------|-------------|
| **Purpose** | React hooks for fetching Firestore data with fallback demo data |
| **Size** | 244 lines |

**Hooks:**
| Hook | Description |
|------|-------------|
| `useCollection(collectionName, options)` | Generic collection fetching hook |
| `useSales(options)` | Fetch sales data |
| `useOrders(options)` | Fetch orders data |
| `useParts(options)` | Fetch parts data |
| `useSupply(options)` | Fetch supply/supplier data |

**Features:**
- Query options: `where`, `orderBy`, `limit`
- Demo data fallback when Firebase permissions fail
- Loading and error states

---

### Page Components

#### `frontEnd/src/pages/Dashboard.jsx`
**Main Dashboard Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Overview page displaying key metrics and visualizations |
| **Size** | 251 lines |

**Sections:**
- Stats cards (Total Parts, Active Orders, Sales Orders, Suppliers)
- Data Import widget
- Inventory Alerts (LowStockAlert component)
- Inventory Status card
- Sales Overview chart
- Supplier Reliability chart
- Recent Orders table

---

#### `frontEnd/src/pages/Analytics.jsx`
**Analytics & Reports Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Deep-dive analytics with multiple chart types |
| **Size** | 628 lines |

**Data Processing Functions:**
- `processInventoryData()` - Analyze inventory levels
- `processOrdersData()` - Analyze order patterns
- `processSalesData()` - Analyze sales trends
- `processPerformanceData()` - Calculate performance metrics

**Charts:** Bar charts, Line charts, Pie charts, Area charts using Recharts

---

#### `frontEnd/src/pages/Parts.jsx`
**Parts Management Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | CRUD operations for parts inventory |
| **Size** | 297 lines |

**Features:**
- Parts list with search and filtering
- Stock status indicators (Critical, Low, Good)
- Add/Edit/Delete part functionality
- Modal forms for part management

---

#### `frontEnd/src/pages/HugoAI.jsx`
**Hugo AI Chat Interface**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Full-page interface for Hugo AI assistant |
| **Size** | 2703 bytes |

**Contains:** HugoChat component for conversational AI interaction

---

#### `frontEnd/src/pages/Map.jsx`
**Supply Chain Map**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Interactive global map showing suppliers and warehouses |
| **Size** | 240 lines |

**Features:**
- MapLibre GL integration
- Warehouse locations (Los Angeles, Chicago, Frankfurt)
- Supplier locations (Shenzhen, Taipei, Berlin, etc.)
- Shipment route visualization with arc layers

---

#### `frontEnd/src/pages/Orders.jsx`
**Orders Management Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Track and manage purchase orders |
| **Size** | 17531 bytes |

**Features:**
- Orders list with status filtering
- Order creation/editing
- Delivery tracking
- Status updates (pending, ordered, delivered)

---

#### `frontEnd/src/pages/Sales.jsx`
**Sales Orders Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Manage sales orders for scooter models |
| **Size** | 13884 bytes |

**Features:**
- Sales order list
- Model and version filtering
- Order type categorization (webshop, fleet_framework)

---

#### `frontEnd/src/pages/Suppliers.jsx`
**Suppliers Management Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Manage supplier relationships |
| **Size** | 16279 bytes |

**Features:**
- Supplier list with reliability ratings
- Lead time and pricing information
- Supplier-part relationship management

---

#### `frontEnd/src/pages/Products.jsx`
**Products/Scooter Models Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | View scooter models and their components |
| **Size** | 11104 bytes |

**Features:**
- Product model cards
- Component tracking
- Stock level monitoring per model

---

#### `frontEnd/src/pages/DataImport.jsx`
**Data Import Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Import data via file upload |
| **Size** | 4586 bytes |

**Features:**
- File uploader component
- JSON file parsing
- Firebase data sync

---

#### `frontEnd/src/pages/Notifications.jsx`
**Notifications Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Display AI-generated inventory alerts |
| **Size** | 213 lines |

**Features:**
- Load notifications from localStorage
- Refresh via Hugo AI query
- Send to Slack functionality
- Mark as read functionality

---

#### `frontEnd/src/pages/Settings.jsx`
**Settings Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Application configuration |
| **Size** | 18565 bytes |

---

#### `frontEnd/src/pages/SignIn.jsx`
**Authentication Page**

| Aspect | Description |
|--------|-------------|
| **Purpose** | User sign-in functionality |
| **Size** | 13132 bytes |

---

### Key Components

#### `frontEnd/src/components/HugoChat.jsx`
**AI Chat Component**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Conversational interface for Hugo AI |
| **Size** | 168 lines |

**Features:**
- Message history display
- Real-time chat with loading states
- Error handling with toast notifications
- Auto-scroll to latest messages

---

#### `frontEnd/src/components/FileUploader.jsx`
**File Upload Component**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Drag-and-drop file uploader for JSON data |
| **Size** | 460 lines |

**Functions:**
- File drag/drop handling
- JSON parsing and validation
- `uploadPartsData()`, `uploadOrdersData()`, `uploadSalesData()`
- `updateSpecsQuantities()` - Update specs based on imported data

---

#### `frontEnd/src/components/Sidebar.jsx`
**Navigation Sidebar**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Main navigation component |
| **Size** | 4168 bytes |

---

#### `frontEnd/src/components/SalesChart.jsx`
**Sales Visualization**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Charts for sales data visualization |
| **Size** | 6357 bytes |

---

#### `frontEnd/src/components/SupplierReliabilityChart.jsx`
**Supplier Metrics Chart**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Visualize supplier reliability ratings |
| **Size** | 5048 bytes |

---

#### `frontEnd/src/components/LowStockAlert.jsx`
**Low Stock Alert Component**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Display parts with critically low stock |
| **Size** | 5793 bytes |

---

#### `frontEnd/src/components/InventoryStatusCard.jsx`
**Inventory Status Summary**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Visual summary of inventory health |
| **Size** | 2756 bytes |

---

#### `frontEnd/src/components/OrdersTable.jsx`
**Orders Data Table**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Tabular display of order data |
| **Size** | 3594 bytes |

---

#### `frontEnd/src/components/ProductModelCard.jsx`
**Product Card Component**

| Aspect | Description |
|--------|-------------|
| **Purpose** | Display product model information |
| **Size** | 10290 bytes |

---

#### Form Components
| Component | Purpose |
|-----------|---------|
| `OrderForm.jsx` | Create/edit orders (7655 bytes) |
| `PartForm.jsx` | Create/edit parts (7815 bytes) |
| `SaleForm.jsx` | Create/edit sales (6938 bytes) |
| `SupplyForm.jsx` | Create/edit supply relationships (8944 bytes) |

---

#### UI Components
| Component | Purpose |
|-----------|---------|
| `Header.jsx` | Page header (1664 bytes) |
| `Modal.jsx` | Modal dialog wrapper (758 bytes) |
| `Toast.jsx` | Toast notification (1622 bytes) |
| `ToastContext.jsx` | Toast state management (1083 bytes) |
| `LoadingSpinner.jsx` | Loading indicator (302 bytes) |
| `ConfirmDialog.jsx` | Confirmation dialog (1298 bytes) |
| `DataImportGuide.jsx` | Import instructions (3632 bytes) |
| `DashboardWidgets.jsx` | Dashboard widget components (1172 bytes) |
| `RoutePopup.jsx` | Map route popup (2375 bytes) |

---

## 🗄️ Firebase Database Schema

```
firestore/
├── orders/{order_id}
│   ├── order_date: string
│   ├── expected_delivery_date: string
│   ├── actual_delivered_at: string
│   ├── part_id: string               # FK → parts/{part_id}
│   ├── supplier_id: string           # FK → supply/{supply_id}
│   ├── quantity_ordered: number
│   └── status: string                # "pending" | "ordered" | "delivered"
│
├── parts/{part_id}
│   ├── part_name: string
│   ├── part_type: string             # "assembly" | "component"
│   ├── location: string
│   ├── quantity: number              # Current stock level
│   ├── min_stock: number
│   ├── blocked: boolean
│   ├── comments: string
│   ├── weight: number | null
│   ├── successor_part: string | null
│   ├── used_in_models: string[]      # e.g., ["S1_V1", "S2_V1"]
│   ├── reorder_interval_days: number
│   ├── reorder_quantity: number
│   ├── bill_of_materials: array      # Sub-parts list
│   └── requirements: string[]        # Assembly requirements
│
├── sales/{sale_id}
│   ├── created_at: string
│   ├── accepted_request_date: string
│   ├── requested_date: string
│   ├── model: string
│   ├── version: string
│   ├── order_type: string            # "webshop" | "retail" | "fleet_framework"
│   └── quantity: number
│
├── supply/{supplier_id}_{part_id}
│   ├── price_per_unit: number
│   ├── lead_time_days: number
│   ├── min_order_qty: number
│   └── reliability_rating: number    # 0-1 scale
│
└── specs/{spec_name}
    ├── bill of materials: array      # Parts required for this spec
    └── [other spec details]
```

---

## 🤖 Hugo AI Agent Architecture

### Agent Flow

```
User Query → Coordinator Model → Specialized Agent → Tool Execution → Structured Response

1. Engineer/ops user asks a question
   ↓
2. Coordinator identifies intent (inventory/order/supplier/sales)
   ↓
3. Request routed to specialized LangChain agent
   ↓
4. Agent retrieves task-relevant data from Firebase
   ↓
5. Agent uses tools to compute and explain
   ↓
6. Swerve returns actionable recommendation
```

### Available Tools

| Tool | Trigger | Output |
|------|---------|--------|
| `check_low_stocks` | Low stock queries | List of parts below minimum |
| `find_supplier_for_part` | Supplier lookups | Supplier details for part |
| `check_pending_orders` | Order status queries | List of pending orders |
| `relationship_evaluation` | BOM/relationship queries | Analysis of part relationships |
| `inventory_alerts` | Alert queries | JSON object of inventory issues |
| `general_questions` | General inventory questions | AI-generated response |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Firebase account with service account credentials
- OpenAI API key
- (Optional) Slack Bot Token

### Environment Variables

**Backend (.env):**
```
SERVICE_ACCOUNT_PATH=path/to/firebase-credentials.json
OPENAI_API_KEY=your_openai_api_key
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_CHANNEL=your_slack_channel_id
```

**Frontend (.env):**
```
VITE_APIKEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
```

### Installation & Running

**Backend:**
```bash
cd backEnd
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py  # Runs on http://localhost:5050
```

**Frontend:**
```bash
cd frontEnd
npm install
npm run dev  # Runs on http://localhost:3000 (proxies /api to backend)
```

---

## 📊 Key Libraries Summary

### Frontend Libraries
| Library | Purpose |
|---------|---------|
| react | UI framework |
| react-router-dom | Client-side routing |
| tailwindcss | Utility CSS |
| recharts | Charts and graphs |
| lucide-react | Icons |
| firebase | Backend services |
| maplibre-gl / react-map-gl | Maps |
| deck.gl | Data visualization layers |
| axios | HTTP requests |

### Backend Libraries
| Library | Purpose |
|---------|---------|
| flask | Web framework |
| flask-cors | CORS handling |
| firebase-admin | Firebase access |
| langchain | AI agent orchestration |
| langchain-openai | OpenAI integration |
| openai | Direct OpenAI API |
| pandas | Data manipulation |
| networkx | Graph algorithms |
| matplotlib | Visualization |
| slack-sdk | Slack integration |
| python-dotenv | Environment variables |

---

## 🏆 Awards & Recognition

- **1st Place** - Dryft AI Challenge @ HackTech 2025 (Caltech)
- Post-hackathon collaboration at Dryft's San Francisco (Neo-funded) offices

---

## 📝 License

This project is licensed under the MIT License.
