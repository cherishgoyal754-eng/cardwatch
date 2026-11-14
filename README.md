# 💳 CARDWATCH — Indian Credit Card Intelligence & Devaluation Tracker

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20with-Vercel-black?logo=vercel)](https://credit-blue.vercel.app)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

> **Know what your bank changes before it costs you money.**  
> Track real-time credit card devaluations, quarterly lounge spend quotas, reward rate adjustments, compare cards side-by-side, and optimize reward points across India's top credit cards.

🌐 **Live Demo:** [https://credit-blue.vercel.app](https://credit-blue.vercel.app)  
📁 **GitHub Repository:** [https://github.com/cherishgoyal754-eng/cardwatch](https://github.com/cherishgoyal754-eng/cardwatch)

---

## 🌟 Key Features

### 1. 📉 Real-Time Devaluation & Change Tracker
- Live changelog of recent bank circulars and policy adjustments.
- Instant alerts on reward rate slashes, milestone program adjustments, capping, and exclusions (fuel, utilities, rent, govt transactions).
- Direct links to official bank MITC (Most Important Terms and Conditions) and circular PDFs.

### 2. 💳 Curated Indian Card Intelligence Directory
Extensive, verified benefit matrices for cards across major issuers:
- **HDFC Bank**: Infinia Metal Edition, Regalia Gold, Diners Club Black, Tata Neu Infinity, Millennia, Swiggy HDFC.
- **Axis Bank**: Magnus, Atlas, ACE, Flipkart Axis, IndianOil Axis.
- **ICICI Bank**: Amazon Pay ICICI, Sapphiro, Emeralde.
- **SBI Card**: Cashback SBI Card, SimplySAVE.
- **American Express**: Platinum Card, Platinum Travel.
- **Others**: Scapia Federal Bank, IDFC FIRST Wealth & Millennia, IndusInd Tiger, Kiwi RuPay.

### 3. 🛫 Airport Lounge Access & Spend Quotas
- Accurate breakdown of domestic & international lounge access rules.
- Tracks newly enforced **quarterly spend thresholds** required to unlock complimentary visits.
- Guest access fees, primary vs add-on card lounge eligibility.

### 4. ⚖️ Interactive Multi-Card Comparison
- Side-by-side comparison of fees, APR, welcome gifts, milestone perks, reward ratios, and lounge terms.
- Highlight specific areas where one card beats another based on annual spending categories.

### 5. 🎯 Card Tailor & Smart Recommendations
- Answer quick spending lifestyle questions (shopping, dining, flights, fuel) to receive mathematical recommendations on the best cards for your profile.

### 6. 🧮 Devaluation Calculator
- Measure how much value you lost due to recent reward cuts or tier reorganizations.

### 7. 🔐 User Card Vault (Supabase Auth)
- Save and curate your personal wallet of cards to track devaluations that directly impact you.
- Safe client-side integration protected by Row-Level Security (RLS).

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6
- **Styling:** Tailwind CSS v4, Framer Motion
- **Icons & Visuals:** Lucide React, Canvas Confetti
- **Backend / Auth:** Supabase Auth & PostgreSQL
- **Hosting & CDN:** Vercel (Production Fluid Compute & Edge Network)

---

## 📁 Project Structure

```
credit/
├── public/                 # Static assets (3D card renders, icons, circulars)
│   └── cards/              # High-definition front/back card textures
├── src/
│   ├── components/         # Reusable UI widgets, Modals, Navbar, Floating dock
│   ├── context/            # AuthContext & custom hooks
│   ├── data/
│   │   └── cards.ts        # Seeded verified credit card intelligence database
│   ├── lib/
│   │   └── supabase.ts     # Supabase client configuration & fallback handler
│   ├── screens/            # Major screens (Home, Explorer, Compare, Tracker, Tailor)
│   ├── types/              # TypeScript interfaces & domain types
│   ├── utils/              # Calculation helpers, audio effects & security
│   ├── App.tsx             # Root application orchestrator
│   └── main.tsx            # Entry point
├── supabase/               # SQL schema migrations & RLS policies
├── vercel.json             # SPA rewrites & Vercel deployment configuration
├── vite.config.ts          # Vite build & Tailwind 4 plugin configuration
└── package.json            # Dependencies & scripts
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cherishgoyal754-eng/cardwatch.git
   cd cardwatch
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional):**
   ```bash
   cp .env.example .env.local
   ```
   *Note: CardWatch comes with built-in fallback data and works out of the box even without Supabase credentials.*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel

The project is pre-configured with `vercel.json` for single-page application (SPA) routing:

```bash
npm install -g vercel
vercel deploy --prod
```

---

## 📄 License

This project is licensed under the ISC License.

Developed by **Cherish Goyal** / **CARDWATCH Technologies**.
