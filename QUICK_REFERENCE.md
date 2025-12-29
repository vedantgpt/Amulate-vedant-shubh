# ⚡ VOLTWAY ERP - Quick Reference Guide

> **Fast answers to common questions**

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Navigate to project
cd "c:\Users\Shubh Varshney\Downloads\Amulate-vedant-shubh\voltway-erp"

# 2. Install dependencies
bun install

# 3. Start development server
bun run dev

# 4. Open browser
# Go to: http://localhost:3000

# 5. Seed database (first time only)
# Click on "Admin" in sidebar → "Seed Database"
```

---

## 📁 File Quick Finder

### **Need to edit the Dashboard?**
📂 `src/app/page.tsx`

### **Need to modify Inventory page?**
📂 `src/app/inventory/page.tsx`

### **Need to change Firebase config?**
📂 `src/lib/firebase.ts`  
📂 `.env.local` (credentials)

### **Need to update styles?**
🎨 Tailwind classes in each component file

### **Need sample data?**
📊 `hugo_data_samples/*.csv`

### **Need database hooks?**
🔗 `src/lib/useFirestore.ts`

---

## 🗺️ Page Navigation Map

```
/                    → Dashboard (homepage)
/admin              → Database seeding
/inventory          → Stock tracking
/procurement        → Purchase orders
/sales              → Sales orders
/materials          → Parts catalog
/suppliers          → Supplier management
/dispatch           → Reorder parameters
/events             → Event tracking
/hugo               → AI assistant
/imports            → Data import tools
/settings           → App settings
```

---

## 🗄️ Database Collections Quick Reference

| Collection | What It Stores | Example |
|------------|---------------|---------|
| **materials** | Parts catalog | P304: 500W Brushless Motor |
| **stock_levels** | Inventory quantities | P304 has 108 units in WH1 |
| **material_orders** | Purchase orders | O5000: Ordered 100x P312 from SupB |
| **sales_orders** | Customer orders | SO-001: 150x S1 V2 for fleet |
| **suppliers** | Supplier info | SupA: Alpha Electronics, rating 0.94 |
| **dispatch_parameters** | Reorder rules | P304: min 50, reorder at 100 |

---

## 🎨 Color Code Guide

| Color | Meaning | Used For |
|-------|---------|----------|
| 🔴 Red | Critical/Urgent | Very low stock, overdue |
| 🟡 Yellow | Warning | Low stock, potential issues |
| 🟢 Green | Healthy | Good stock, on track |
| 🔵 Blue | Info/In-progress | Tracking, processing |
| 🟣 Purple/Indigo | AI Features | Hugo assistant |
| ⚫ Gray | Neutral | Inactive, disabled |

---

## 🔧 Common Commands

### **Development**
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run linter
```

### **Git**
```bash
git status           # Check changes
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Push to remote
```

---

## 🐛 Troubleshooting Cheat Sheet

### **Problem: Can't see data**
✅ **Solution**: Go to `/admin` → Click "Seed Database"

### **Problem: Firebase error**
✅ **Solution**: Check `.env.local` has correct credentials

### **Problem: Page won't load**
✅ **Solution**: 
1. Check dev server is running (`bun run dev`)
2. Try http://localhost:3000
3. Clear browser cache (Ctrl+Shift+Delete)

### **Problem: Module not found**
✅ **Solution**: Run `bun install` again

### **Problem: Port already in use**
✅ **Solution**: 
```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000

# Then restart
bun run dev
```

---

## 📊 Key Metrics Explained

### **Daily Build Rate**
How many scooters assembled today (target: ~140-150)

### **Active Stockouts**
Parts below minimum stock level (target: < 5)

### **On-Time Delivery**
% of orders delivered on time (target: > 95%)

### **Total Sales Units**
Total scooter orders (all channels combined)

---

## 🎯 User Roles (Future)

| Role | Can Do |
|------|--------|
| **Viewer** | See dashboard, reports (read-only) |
| **Operator** | Create orders, update stock |
| **Manager** | Approve orders, change parameters |
| **Admin** | Full access, seed database |

---

## 🔑 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 🎪 Demo Data Overview

### **Parts**: 24 items
- Motors, batteries, wheels, frames, controllers, etc.

### **Suppliers**: 10 companies
- Alpha Electronics, Beta Motors, Gamma Parts, etc.

### **Orders**: ~100 purchase orders
- Mix of pending, ordered, delivered

### **Sales**: ~50 sales orders
- Webshop, fleet framework, fleet spot

---

## 💬 Hugo AI Query Examples (Future)

```
"What parts are running low?"
"Can we build 200 S2 V2 scooters this week?"
"Which suppliers are most reliable?"
"Show me all delayed orders"
"What's the total value of pending orders?"
"Which parts have the highest usage rate?"
"Alert me if P304 goes below 50 units"
```

---

## 🏗️ Architecture at a Glance

```
Browser (UI)
    ↓
Next.js App (React)
    ↓
Firebase Hooks (Data fetching)
    ↓
Firestore (Cloud DB)
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All pages work on all devices!

---

## 🎨 Component Library

### **Layout**
- `Header.tsx`: Page header
- `Sidebar.tsx`: Navigation sidebar

### **UI**
- `Modal.tsx`: Dialog/popup

### **Custom Hooks**
- `useMaterials()`: Fetch parts
- `useStockLevels()`: Fetch inventory
- `useMaterialOrders()`: Fetch purchase orders
- `useSalesOrders()`: Fetch sales orders
- `useSuppliers()`: Fetch suppliers
- `useDispatchParameters()`: Fetch reorder rules

---

## 🔄 Data Flow

```
1. User opens page
2. Page component loads
3. Firebase hooks fetch data
4. React state updates
5. UI renders with data
6. User interacts (e.g., creates order)
7. Data sent to Firebase
8. Firebase broadcasts change
9. All connected clients update
10. Loop continues...
```

---

## 🎓 Learning Path

### **Beginner**
1. Understand what the app does (read PROJECT_SUMMARY.md)
2. Run it locally
3. Click through all pages
4. Seed the database

### **Intermediate**
1. Read `src/app/page.tsx` (dashboard)
2. Understand Firebase hooks
3. Modify a component (change text/color)
4. See your changes

### **Advanced**
1. Add a new page
2. Create a new Firebase collection
3. Build a custom hook
4. Implement new feature

---

## 🚨 Critical Files (Don't Delete!)

- `.env.local` - Firebase credentials
- `src/lib/firebase.ts` - Firebase config
- `src/lib/useFirestore.ts` - Data hooks
- `src/lib/data.ts` - Demo data
- `package.json` - Dependencies

---

## 📈 Performance Tips

1. **Use React DevTools** to inspect components
2. **Use Firebase Console** to view database
3. **Use Browser DevTools** (F12) to debug
4. **Check Network tab** for slow requests

---

## 🎁 Easter Eggs

- Dark mode toggle (coming soon)
- Hugo AI chat interface (ready for backend)
- Real-time updates (already working!)
- Material Design icons throughout

---

## 📞 Need More Help?

1. **PROJECT_SUMMARY.md** - Complete guide (read this first!)
2. **VOLTWAY_PRD_v2.md** - Detailed requirements
3. **understanding.md** - Technical deep-dive
4. **This file** - Quick answers

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| First-time setup | 10-15 min |
| Add new page | 30-60 min |
| Modify existing page | 15-30 min |
| Add new data field | 20-40 min |
| Fix bug | 10-60 min |
| Learn codebase | 2-4 hours |

---

## 🎯 Next Steps

### **If you want to...**

**...understand the project:**
→ Read PROJECT_SUMMARY.md

**...run it locally:**
→ Follow "Quick Start" above

**...modify something:**
→ Find file in "File Quick Finder"

**...add a feature:**
→ Study similar page, copy pattern

**...deploy it:**
→ Run `bun run build` → Deploy to Vercel

---

## 🌟 Pro Tips

1. **Use VS Code** with TypeScript extension
2. **Install React DevTools** browser extension
3. **Keep Firebase Console** open in another tab
4. **Use Claude/ChatGPT** to explain code snippets
5. **Test in Chrome DevTools** mobile view

---

**Keep this handy!** Bookmark this page for instant answers.

---

**Last Updated**: December 29, 2024  
**Version**: 1.0
