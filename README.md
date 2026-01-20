# INTIMA∞ Ecosystem

![INTIMA∞ Logo](./logo.png)

INTIMA∞ is a comprehensive, production-ready relationship ecosystem designed for adults (18+). It merges public discovery, private intimacy, reproductive health tracking, and AI-driven intelligence into a single, secure platform.

## 📖 Table of Contents
- [Intro](#-intima-ecosystem)
- [✨ Core Features](#-core-features)
  - [Public Dating & Love Discovery](#public-dating--love-discovery)
  - [Private Couple Mode](#private-couple-mode)
  - [Intimacy & Sex Games](#intimacy--sex-games)
  - [Reproductive Health & Prediction](#reproductive-health--prediction)
  - [AI Intelligence (IntimaBrain)](#ai-intelligence-intimabrain)
  - [Economy & Virtual Gifts](#economy--virtual-gifts)
- [🛠 Technical Stack](#-technical-stack)
- [🚀 Architecture](#-architecture)
- [📦 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [💻 Running the Project](#-running-the-project)
- [📂 Project Structure](#-project-structure)
- [🔒 Safety & Privacy](#-safety--privacy)
- [📄 License](#-license)

---

## ✨ Core Features

### Public Dating & Love Discovery
- **Extended Profiles**: Detailed bios, interests, and relationship goals.
- **Match & Like System**: Connect with like-minded individuals.
- **Community Hub**: Public rooms, posts, and discussions for social interaction.

### Private Couple Mode
- **Invite-Only Pairing**: Securely connect with a partner for a private experience.
- **Encrypted Environment**: A dedicated space for couple communication.
- **Shared Memories**: Store photos, voice notes, and text memories in a shared vault.

### Intimacy & Sex Games
- **Interactive Engines**: Truth, Dare, and Desire engine for couples.
- **Fantasy Builder**: Tools to help couples explore their desires.
- **Game Intensity Control**: Switch between Playful, Romantic, Spicy, and Erotic modes.

### Reproductive Health & Prediction
- **Period & Cycle Tracking**: Log periods, symptoms, and flow intensity.
- **Fertility Insights**: Basic tracking and future predictions for family planning.
- **Conception Engine**: Educational data on conception timing.

### AI Intelligence (IntimaBrain)
- **Flirt Architect**: AI-generated icebreakers and conversation starters.
- **Intimacy Catalyst**: Mood-based suggestions and erotic teasing for couples.
- **Resolution Specialist**: Emotional distance detection and conflict repair attempts.

### Economy & Virtual Gifts
- **Wallet System**: In-app credits for transactions and gifts.
- **Virtual Gifts**: Send symbols of affection that hold value.
- **Withdrawals**: Secure process for converting in-app credits.

---

## 🛠 Technical Stack

- **Backend**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Frontend (Web)**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/)
- **Mobile Application**: [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/)
- **Database**: [MySQL](https://www.mysql.com/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Passport.js](http://www.passportjs.org/) (Google OAuth)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Icons & UI**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Architecture

The project follows a monorepo-style structure:
- **Client**: Single Page Application (SPA) for web access.
- **Server**: REST API with real-time capabilities and session management.
- **Mobile**: Native mobile experience for iOS and Android.
- **Shared**: Shared TypeScript types and Drizzle schemas synchronized across all environments.

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MySQL](https://www.mysql.com/) server instance

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/agent-ecosystem.git
    cd agent-ecosystem
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # Also install mobile dependencies
    cd mobile && npm install && cd ..
    ```

3.  **Database Setup**:
    - Ensure your MySQL server is running.
    - Create a database named `intima_db`.
    - Run migrations: `npm run db:push`

### Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="mysql://username:password@localhost:3306/intima_db"
SESSION_SECRET="your_secure_session_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
```

---

## 💻 Running the Project

### Development Mode
To start both the backend server and the web frontend concurrently:
```bash
npm run dev
```

### Mobile Development
To start the Expo development server:
```bash
cd mobile
npx expo start
```

### Build for Production
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```text
├── client/          # Web frontend (React + Vite) - see client/README.md
├── server/          # Backend server (Express + Node.js) - see server/README.md
├── mobile/          # Mobile application (Expo + React Native) - see mobile/README.md
├── shared/          # Shared database schema and types
├── migrations/      # Drizzle migration files
├── docs/            # Documentation and design plans
└── public/          # Static assets
```

---

## 🔒 Safety & Privacy

- **Consent Logs**: Every intimate interaction requires logged consent (Section N).
- **Encrypted Vaults**: Sensitive media and messages are stored in isolated environments.
- **Age Verification**: Mandatory checks to ensure all users are over 18.
- **Privacy Gates**: Public vs. Private mode toggles for profile visibility.

---

## 📄 License

This project is proprietary. All rights reserved.
