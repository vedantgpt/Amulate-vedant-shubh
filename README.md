<div align="center">

# ⚡ Voltway ERP

### AI-Native Enterprise Resource Planning System

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12-orange?logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MegaLLM](https://img.shields.io/badge/MegaLLM-AI%20Powered-purple)

*A modern ERP system for electric scooter manufacturing with AI-powered procurement intelligence*

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

Voltway ERP is a comprehensive operations management system designed for electric scooter manufacturing. It features **Hugo AI**, an intelligent procurement copilot powered by MegaLLM that helps manage inventory, analyze stock levels, and automate procurement decisions.

## ✨ Features

### 📊 Dashboard & Analytics
- **Real-time KPIs** - Monitor daily build rates, stock levels, and delivery metrics
- **Production tracking** - Track model-wise production capacity (S1, S2, S3 variants)
- **Logistics overview** - View incoming shipments and delivery status

### 🤖 Hugo AI Copilot
- **Natural language queries** - Ask questions about inventory, orders, and suppliers
- **Document analysis** - Upload PDFs or images for AI-powered analysis
- **Database actions** - Create, update, delete records via conversational commands
- **PDF export** - Export conversations and individual responses as formatted reports
- **Email automation** - Send reorder requests to suppliers automatically

### 📦 Inventory Management
- **Stock level monitoring** - Track quantity, location, and status
- **Automatic alerts** - Critical, low, and healthy stock indicators
- **Reorder suggestions** - AI-powered reorder quantity recommendations

### 🛒 Procurement
- **Order tracking** - Monitor material orders from creation to delivery
- **Supplier management** - Track supplier reliability and lead times
- **Dispatch rules** - Configure min stock levels and reorder parameters

### 🚀 Modern UI
- **Glassmorphism design** - Clean, modern interface with subtle animations
- **Responsive layout** - Works on desktop and mobile devices
- **Dark mode support** - Full dark mode compatibility

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Firebase project with Firestore enabled
- MegaLLM API key (for Hugo AI)

### Installation

```bash
# Clone the repository
git clone https://github.com/vedantgpt/Amulate-vedant-shubh.git
cd Amulate-vedant-shubh/voltway-erp

# Install dependencies
bun install
# or: npm install

# Copy environment file
cp env.example .env.local

# Start development server
bun run dev
# or: npm run dev
```

### Environment Variables

Create `.env.local` with the following:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# MegaLLM API (for Hugo AI)
MEGALLM_API_KEY=your_megallm_api_key

# Resend API (for email functionality)
RESEND_API_KEY=your_resend_api_key
```

---

## 📁 Project Structure

```
voltway-erp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/hugo/           # Hugo AI API endpoints
│   │   │   ├── route.ts        # Main chat endpoint
│   │   │   ├── email/route.ts  # Email sending endpoint
│   │   │   └── actions/route.ts# Database actions endpoint
│   │   ├── hugo/page.tsx       # Hugo AI chat interface
│   │   ├── inventory/          # Inventory management
│   │   ├── materials/          # Materials catalog
│   │   ├── procurement/        # Order management
│   │   ├── suppliers/          # Supplier directory
│   │   └── page.tsx            # Dashboard
│   ├── components/
│   │   └── layout/             # Sidebar, Header components
│   └── lib/
│       ├── firebase.ts         # Firebase client setup
│       ├── useFirestore.ts     # Firestore React hooks
│       └── hugo/               # Hugo AI module
│           ├── llm.ts          # LLM configuration
│           ├── prompts.ts      # System prompts
│           ├── tools.ts        # LangChain tools
│           ├── reasoning.ts    # Business logic
│           └── agent.ts        # Agent assembly
├── env.example                 # Environment template
└── package.json
```

---

## 🔧 Hugo AI Features

### Chat Commands

| Command Type | Example |
|-------------|---------|
| **Stock Query** | "What parts are running low?" |
| **Update Stock** | "Update stock for P305 to 200 units" |
| **Mark Delivered** | "Mark order ORD-001 as delivered" |
| **Add Material** | "Add material P999 Motor Assembly" |
| **Delete Record** | "Delete material P305" |
| **Send Email** | "Send reorder email for P310 to supplier" |

### Document Upload

Hugo can analyze uploaded documents:
- **PDF files** - Extracts text for analysis (up to 8000 characters)
- **Images** - JPG, PNG support with description-based analysis

### PDF Export

Export capabilities:
- **Full conversation** - Export entire chat history
- **Single response** - Export individual AI responses
- **Formatted output** - Tables, headers, bullets properly styled

---

## 🗃️ Database Schema

### Firestore Collections

| Collection | Description |
|------------|-------------|
| `materials` | Part catalog with specifications |
| `stock_levels` | Current inventory quantities |
| `dispatch_parameters` | Reorder rules and thresholds |
| `material_orders` | Purchase orders to suppliers |
| `sales_orders` | Customer orders |
| `suppliers` | Supplier contact and performance data |

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | Firebase Firestore |
| AI/LLM | MegaLLM (OpenAI-compatible) |
| PDF Generation | jsPDF |
| Email | Resend |
| Package Manager | Bun / npm |

---

## 📖 API Reference

### POST `/api/hugo`

Main Hugo AI chat endpoint.

**Request:**
```json
{
  "message": "What parts are low on stock?",
  "databaseContext": { ... },
  "conversationHistory": [...],
  "file": {
    "name": "invoice.pdf",
    "content": "base64...",
    "type": "pdf"
  }
}
```

**Response:**
```json
{
  "response": "Based on current data...",
  "action": null,
  "model": "openai-gpt-oss-120b",
  "provider": "MegaLLM + LangChain"
}
```

### POST `/api/hugo/email`

Send reorder emails to suppliers.

### POST `/api/hugo/actions`

Execute database operations (add, update, delete).

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Use TypeScript for all new files
- Follow the existing code style
- Add comments for complex logic
- Test thoroughly before submitting PRs

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Vedant** - *Developer*
- **Shubh** - *Developer*

---

## 🙏 Acknowledgments

- [MegaLLM](https://megallm.io) for AI capabilities
- [Firebase](https://firebase.google.com) for backend services
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for styling

---

<div align="center">

**Built with ❤️ for modern manufacturing operations**

⭐ Star this repo if you find it helpful!

</div>
