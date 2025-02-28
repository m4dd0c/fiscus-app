# Fiscus - Family Financial Management Dashboard

## Overview

**Fiscus** is a full-stack financial management platform designed for families and family-run businesses. It provides **real-time financial tracking, AI-powered insights, automated alerts, and secure role-based access** to manage assets efficiently.

## Features 🚀

- **Unified Financial Dashboard** – Track bank accounts, properties, businesses, and securities.
- **Role-Based Access Control** – Admin, Family Member, Accountant with secure permissions.
- **Plaid API Integration** – Sync real-time banking transactions and balances.
- **AI-Powered Insights (OpenAI)** – Get smart financial recommendations.
- **Automated Alerts (Twilio)** – Bill payment reminders, policy renewals, and suspicious transactions.
- **Export & Sync (Google Sheets API)** – Maintain historical financial records.
- **Fund Transfers (Coming Soon)** – Secure ACH transfers via **Dwolla**.

## Tech Stack ⚡

- **Frontend:** Next.js, ShadCN, TailwindCSS
- **Backend:** Next.js API routes, Prisma, PostgreSQL
- **Authentication:** NextAuth.js (OAuth2/JWT)
- **APIs Used:** Plaid (Banking), Twilio (SMS), Google Sheets, OpenAI (AI Insights)
- **Deployment:** Vercel (Frontend), AWS/Railway (Backend)

## Installation & Setup 🛠️

### 1. Clone the Repository

```bash
git clone https://github.com/m4dd0c/fiscus-app.git
cd fiscus
```

### 2. Install Dependencies

```bash
npm install  # or npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

```
DATABASE_URL=your_postgres_url
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
GOOGLE_SHEETS_API_KEY=your_api_key
OPENAI_API_KEY=your_api_key
```

### 4. Run the Development Server

```bash
npm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action.

## Deployment 🚀

- **Frontend:** Deploy to [Vercel](https://vercel.com/)
- **Backend:** Host on **AWS, Railway, or another cloud provider**

## Contributing 🤝

Pull requests are welcome! Open an issue for feature requests or bug reports.

---

Made with ❤️ for financial peace of mind. **Fiscus - Smart Finance for Families.**
# fiscus-app
