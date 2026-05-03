# 🧭 CivicCompass — Your Guide to Every Vote

> AI-assisted election guidance for Indian voters. Navigate your election journey from eligibility to results — step by step.

![Phase](https://img.shields.io/badge/Phase-1%20(MVP)-blue)
![Stack](https://img.shields.io/badge/Stack-Next.js%20%2B%20Express%20%2B%20Firestore-green)
![AI](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20Flash-orange)
![Deploy](https://img.shields.io/badge/Deploy-Google%20Cloud%20Run-4285F4)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Phase 1 Scope](#phase-1-scope)
- [Documentation](#documentation)
- [License](#license)

---

## Overview

CivicCompass is a web application that helps Indian citizens navigate the entire election process — from checking eligibility and registering to vote, to finding their polling booth and understanding the voting process.

**Phase 1** is a deterministic, rule-based system that uses:
- **Static mock data** (mirroring Firestore schema) for all election information
- **Rule engines** for all logic decisions (eligibility, journey stages, next steps)
- **Google Gemini** solely as an explanation/translation layer — it **never influences logic**

---

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│                 │     │                      │     │                 │
│  Next.js 14     │────▶│  Express.js API      │────▶│  Firestore      │
│  Frontend       │     │  (Rule Engines)      │     │  (Mock Data)    │
│  (React 18)     │     │                      │     │                 │
│                 │     │  ┌──────────────┐    │     └─────────────────┘
│                 │     │  │ Gemini 1.5   │    │
│                 │     │  │ (Explain     │    │
│                 │     │  │  Layer Only) │    │
│                 │     │  └──────────────┘    │
└─────────────────┘     └──────────────────────┘
```

---

## Features

| Feature | Description |
|---------|-------------|
| 🛡️ **Eligibility Check** | Rule-based age & citizenship validation |
| 📝 **Journey Tracker** | 6-stage progress roadmap with visual progress bar |
| 🎯 **Next Steps** | Top 3 personalized action recommendations |
| 📅 **Election Timeline** | State-specific election schedule |
| ✅ **Checklist** | Voter preparation checklists (first-time, registered, polling day) |
| 📍 **Booth Locator** | Find assigned polling booth by district/state |
| ❓ **Myth vs Fact** | Interactive flip cards busting election myths |
| 🗳️ **Practice Voting** | Step-by-step EVM voting simulation |
| 💬 **AI Assistant** | Gemini-powered explanations in multiple styles |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Framer Motion, Lucide Icons |
| Backend | Node.js, Express.js, express-validator, Helmet, Morgan |
| Database | Google Cloud Firestore (with local mock data for development) |
| AI | Google Gemini 1.5 Flash (explanation/translation only) |
| Deployment | Google Cloud Run (Docker containers) |
| Testing | Jest, Supertest, React Testing Library |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Google Gemini API Key** (get one at [makersuite.google.com](https://makersuite.google.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/Aditya-Coder477/CivicCompass-.git
cd CivicCompass

# ─── Backend Setup ───────────────────────────────────
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm install

# ─── Frontend Setup ─────────────────────────────────
cd ../frontend
cp .env.example .env.local
npm install
```

### Running Locally

```bash
# Terminal 1 — Start Backend (port 8080)
cd backend
npm run dev

# Terminal 2 — Start Frontend (port 3000)
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The backend runs with `USE_LOCAL_DATA=true` by default, so you don't need a Firestore instance for development.

---

## Project Structure

```
CivicCompass/
├── backend/
│   ├── server.js                    # Express app entry point
│   ├── src/
│   │   ├── engine/                  # Deterministic rule engines
│   │   │   ├── eligibility.js       # Age & citizenship validation
│   │   │   ├── journeyEngine.js     # 6-stage journey calculator
│   │   │   ├── nextStepEngine.js    # Top 3 action recommender
│   │   │   ├── checklistEngine.js   # Checklist generator
│   │   │   ├── timelineEngine.js    # State timeline lookup
│   │   │   └── boothEngine.js       # Polling booth finder
│   │   ├── routes/                  # API route handlers
│   │   ├── services/                # Firestore & Gemini services
│   │   ├── data/                    # Local mock data (mirrors Firestore)
│   │   └── scripts/                 # Firestore seed script
│   ├── tests/                       # Backend test suite
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js pages
│   │   │   ├── page.js              # Home / onboarding
│   │   │   ├── journey/             # Journey tracker
│   │   │   ├── timeline/            # Election timeline
│   │   │   ├── checklist/           # Voter checklist
│   │   │   ├── myths/               # Myth vs Fact cards
│   │   │   ├── booth-locator/       # Booth finder
│   │   │   ├── simulate/            # Voting simulation
│   │   │   └── chat/                # AI assistant
│   │   ├── components/              # Shared components
│   │   └── lib/                     # API client
│   ├── __tests__/                   # Frontend test suite
│   ├── Dockerfile
│   └── package.json
└── Documentation/                   # Project documentation (.docx)
```

---

## API Endpoints

All endpoints are `POST` requests to the backend at `http://localhost:8080`.

| Endpoint | Description | Auth |
|----------|-------------|------|
| `POST /api/journey` | Get journey stage & AI explanation | None |
| `POST /api/next-steps` | Get top 3 recommended actions | None |
| `POST /api/timeline` | Get state election timeline | None |
| `POST /api/explain` | Get Gemini-powered explanation | None |
| `POST /api/myth-fact` | Get myth vs fact cards | None |
| `POST /api/checklist` | Get voter checklist | None |
| `POST /api/booth-locator` | Find polling booth | None |
| `POST /api/simulate-voting` | Get voting simulation steps | None |
| `GET /health` | Health check | None |

---

## Testing

### Backend Tests

```bash
cd backend
npm install    # Ensure jest & supertest are installed
npm test       # Run all tests

# Generate markdown test report
npm run test:report

# Run live Gemini smoke tests (requires valid API key)
npm run test:smoke
```

**Test coverage includes:**
- Unit tests for all 6 rule engines
- Mock data validation (all 5 collections)
- Gemini service tests (mocked + live smoke)
- API integration tests (all 8 endpoints)
- Security validation (XSS, injection, key exposure)
- Edge case tests (boundary values, null inputs)
- Performance benchmarks

### Frontend Tests

```bash
cd frontend
npm install    # Ensure jest & RTL are installed
npm test       # Run component tests
```

---

## Deployment

Both frontend and backend are containerized with Docker for deployment to Google Cloud Run.

```bash
# Build and deploy backend
cd backend
gcloud run deploy civiccompass-api --source .

# Build and deploy frontend
cd frontend
gcloud run deploy civiccompass-frontend --source .
```

---

## Phase 1 Scope

### ✅ Included in Phase 1
- Deterministic rule-based logic for all decisions
- Static mock data (mirrors Firestore schema)
- Gemini used ONLY for explanation, summarization, and translation
- 6-stage journey tracker with progress visualization
- Interactive voting simulation
- Myth vs Fact flip cards
- Source badges on all data displays

### Planned for Phase 2
- Real-time ECI data integration
- RAG (Retrieval-Augmented Generation)
- Web scraping of official sources
- Live polling booth queues
- User authentication
- Real map integration

---

## Documentation

The `Documentation/` folder contains:
- **Technical Document** — System architecture, data models, API specs
- **Design Document** — UI/UX design decisions, color system, component library
- **Document** — Project overview, requirements, and planning

---

## License

This project is developed for educational and civic engagement purposes.

---


