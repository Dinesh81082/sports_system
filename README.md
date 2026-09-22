# ⚽ Sports Athlete Management System

A full-stack web app built with **Vite + React**, **Node.js / Express**, and **MongoDB (Mongoose)**.

---

## 📁 Project Structure

```
sports-athlete-mgmt/
├── backend/
│   ├── config/
│   │   ├── db.js          ← MongoDB (Mongoose) connection & Data Service
│   │   └── schema.sql     ← Original SQL schema reference
│   ├── models/
│   │   ├── Team.js        ← Mongoose Team Schema
│   │   ├── Player.js      ← Mongoose Player Schema
│   │   ├── Coach.js       ← Mongoose Coach Schema
│   │   ├── Match.js       ← Mongoose Match Schema
│   │   └── Score.js       ← Mongoose Score Schema
│   ├── routes/
│   │   ├── teams.js
│   │   ├── players.js
│   │   ├── coaches.js
│   │   ├── matches.js
│   │   └── scores.js
│   ├── package.json
│   └── server.js          ← Express server & API routes
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   └── Modal.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Teams.jsx
    │   │   ├── Players.jsx
    │   │   ├── Coaches.jsx
    │   │   ├── Matches.jsx
    │   │   └── Scores.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🛠️ Setup Instructions

### 1. MongoDB Database

Configure your MongoDB connection string in `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sports_mgmt
```

If no `MONGODB_URI` is provided, the application runs automatically with the embedded MongoDB-compatible in-memory store pre-populated with sample sports data.

### 3. Backend Setup

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:5000
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| GET    | /api/teams           | Get all teams      |
| POST   | /api/teams           | Create team        |
| PUT    | /api/teams/:id       | Update team        |
| DELETE | /api/teams/:id       | Delete team        |
| GET    | /api/players         | Get all players    |
| POST   | /api/players         | Create player      |
| PUT    | /api/players/:id     | Update player      |
| DELETE | /api/players/:id     | Delete player      |
| GET    | /api/coaches         | Get all coaches    |
| POST   | /api/coaches         | Create coach       |
| PUT    | /api/coaches/:id     | Update coach       |
| DELETE | /api/coaches/:id     | Delete coach       |
| GET    | /api/matches         | Get all matches    |
| POST   | /api/matches         | Schedule match     |
| PUT    | /api/matches/:id     | Update match       |
| DELETE | /api/matches/:id     | Delete match       |
| GET    | /api/scores          | Get all scores     |
| POST   | /api/scores          | Record score       |
| PUT    | /api/scores/:id      | Update score       |
| DELETE | /api/scores/:id      | Delete score       |

---

## 🗃️ Database Schema (from ER Diagram)

- **Team** — Team_id, Team_name, Coach_name, Home_ground
- **Coach** — Coach_id, Coach_name, Team_id (FK), Age, Experience
- **Players** — PLY_id, PLY_name, Team_id (FK), Position
- **Matches** — Match_id, Ground, date, Home_team_id (FK), Away_team_id (FK)
- **Score** — Score_id, Match_id (FK), Win_team (FK), Home_Score, Away_Score

---

## ✅ Features

- 📊 Dashboard with stats and recent matches
- 🛡️ Teams — Create, Read, Update, Delete
- ⚽ Players — CRUD with team assignment & position filter
- 🎯 Coaches — CRUD with experience level badge
- 🏆 Matches — Schedule and manage match fixtures
- 📋 Scores — Record and update match results with winner
