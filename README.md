# 🚀 AI Expense Reimbursement System (Hackathon MVP)

An intelligent, multi-tenant enterprise expense management platform engineered for the **Oddo Hackathon**. 

This platform redefines corporate finance workflows by integrating **Local AI Analysis**, **Intelligent Receipt Parsing**, and a strict **Multi-Tier Approval State Machine**, fully wrapped in a modern Generative UI (Glassmorphism & High-Motion).

## ✨ Core Features
- **🤖 Embedded AI Insights**: Every expense is scanned by a heuristic engine to generate localized Fraud Risk scores, intercept informal justification language, and auto-recommend payout decisions.
- **🛡️ Multi-Level Corporate Approval Matrix**: Role-Based Access Control natively enforcing a strict workflow: `Employee` -> `Manager` -> `Corporate Finance Admin`.
- **💬 Interactive Reject Negotiations**: Managers can actively flag, negotiate, and append specific warning rationale directly into an Employee's expense document timeline using dynamic browser prompts.
- **💳 Smart OCR Fallbacks**: Seamless Drag & Drop file attachment that intelligently extracts amounts (e.g., INR calculations) without ruthlessly destroying existing manual human-overrides.
- **💻 Embedded Database Console**: A beautifully transparent, React-injected raw hacker terminal for Hackathon Judges to independently verify NoSQL JSON payloads inline.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, TailwindCSS 
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Memory Server (Zero-Config RAM injection for flawless live demos)
- **Authentication**: JWT & Bcrypt

## 🚦 Quickstart
Because this MVP leverages an isolated *In-Memory Database*, absolutely **zero software configuration or MongoDB Atlas installation is required**! 

1. **Start the Express API**
```bash
cd server
npm start
```
2. **Start the Vite Frontend**
```bash
cd client
npm run dev
```

## 🔐 Fast-Track Login Credentials
Once the environment initializes on `localhost`, click the **"Demo Initialization"** button natively on the Login Page to dynamically seed the database in milliseconds.

*   **Admin/Finance**: `admin@company.com` | `password`
*   **Manager**: `manager@company.com` | `password`
*   **Employee**: `employee@company.com` | `password`
*   



Deployed Link : https://odoo-hackathon-cpdrewugl-atharvak338-gmailcoms-projects.vercel.app/
