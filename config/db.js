import mongoose from 'mongoose';
import Team from '../models/Team.js';
import Player from '../models/Player.js';
import Coach from '../models/Coach.js';
import Match from '../models/Match.js';
import Score from '../models/Score.js';

// Initial sample data from schema
const initialTeams = [
  { Team_id: 1, Team_name: 'Mumbai Warriors', Coach_name: 'Rahul Sharma', Home_ground: 'Wankhede Stadium' },
  { Team_id: 2, Team_name: 'Delhi Dynamos', Coach_name: 'Suresh Patel', Home_ground: 'Feroz Shah Kotla' },
  { Team_id: 3, Team_name: 'Chennai Kings', Coach_name: 'Anil Kumar', Home_ground: 'Chepauk Stadium' },
  { Team_id: 4, Team_name: 'Kolkata Knights', Coach_name: 'Vijay Singh', Home_ground: 'Eden Gardens' },
];

const initialCoaches = [
  { Coach_id: 1, Coach_name: 'Rahul Sharma', Team_id: 1, Age: 48, Experience: 15 },
  { Coach_id: 2, Coach_name: 'Suresh Patel', Team_id: 2, Age: 52, Experience: 20 },
  { Coach_id: 3, Coach_name: 'Anil Kumar', Team_id: 3, Age: 45, Experience: 12 },
  { Coach_id: 4, Coach_name: 'Vijay Singh', Team_id: 4, Age: 55, Experience: 22 },
];

const initialPlayers = [
  { PLY_id: 1, PLY_name: 'Rohit Verma', Team_id: 1, Position: 'Forward' },
  { PLY_id: 2, PLY_name: 'Amit Tiwari', Team_id: 1, Position: 'Midfielder' },
  { PLY_id: 3, PLY_name: 'Sanjay Gupta', Team_id: 2, Position: 'Defender' },
  { PLY_id: 4, PLY_name: 'Ravi Kapoor', Team_id: 2, Position: 'Goalkeeper' },
  { PLY_id: 5, PLY_name: 'Arjun Nair', Team_id: 3, Position: 'Forward' },
  { PLY_id: 6, PLY_name: 'Karan Mehta', Team_id: 3, Position: 'Midfielder' },
  { PLY_id: 7, PLY_name: 'Dev Sharma', Team_id: 4, Position: 'Defender' },
  { PLY_id: 8, PLY_name: 'Nikhil Joshi', Team_id: 4, Position: 'Forward' },
];

const initialMatches = [
  { Match_id: 1, Ground: 'Wankhede Stadium', date: '2025-03-10 15:00:00', Home_team_id: 1, Away_team_id: 2 },
  { Match_id: 2, Ground: 'Chepauk Stadium', date: '2025-03-15 17:00:00', Home_team_id: 3, Away_team_id: 4 },
  { Match_id: 3, Ground: 'Eden Gardens', date: '2025-03-20 16:00:00', Home_team_id: 4, Away_team_id: 1 },
  { Match_id: 4, Ground: 'Feroz Shah Kotla', date: '2025-03-25 18:00:00', Home_team_id: 2, Away_team_id: 3 },
];

const initialScores = [
  { Score_id: 1, Match_id: 1, Win_team: 1, Home_Score: 3, Away_Score: 1 },
  { Score_id: 2, Match_id: 2, Win_team: 3, Home_Score: 2, Away_Score: 0 },
  { Score_id: 3, Match_id: 3, Win_team: 1, Home_Score: 1, Away_Score: 2 },
  { Score_id: 4, Match_id: 4, Win_team: 2, Home_Score: 4, Away_Score: 2 },
];

// In-memory state for fallback / offline mode
let memoryTeams = JSON.parse(JSON.stringify(initialTeams));
let memoryCoaches = JSON.parse(JSON.stringify(initialCoaches));
let memoryPlayers = JSON.parse(JSON.stringify(initialPlayers));
let memoryMatches = JSON.parse(JSON.stringify(initialMatches));
let memoryScores = JSON.parse(JSON.stringify(initialScores));

let nextTeamId = 5;
let nextCoachId = 5;
let nextPlayerId = 9;
let nextMatchId = 5;
let nextScoreId = 5;

let isMongoConnected = false;

// Fast fail on buffer commands to prevent hanging
mongoose.set('bufferCommands', false);

const seedDatabaseIfEmpty = async () => {
  try {
    const teamCount = await Team.countDocuments();
    if (teamCount === 0) {
      console.log('🌱 Seeding MongoDB with initial sports management data...');
      await Team.insertMany(initialTeams);
      await Coach.insertMany(initialCoaches);
      await Player.insertMany(initialPlayers);
      await Match.insertMany(initialMatches);
      await Score.insertMany(initialScores);
      console.log('✅ MongoDB seeding completed.');
    }
  } catch (err) {
    console.warn('MongoDB seed skipped or failed:', err.message);
  }
};

export const connectDB = async () => {
  const rawURI = process.env.MONGODB_URI;
  const mongoURI = typeof rawURI === 'string' ? rawURI.trim() : '';

  if (!mongoURI) {
    console.log('ℹ️  No MONGODB_URI configured. Running with in-memory MongoDB-compatible store.');
    return;
  }

  // Validate format to prevent noisy connection failures when placeholder/invalid strings are passed
  if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
    console.log(
      `ℹ️  MONGODB_URI is currently set to "${mongoURI}". MongoDB connection strings must start with "mongodb://" or "mongodb+srv://". Using in-memory store until a valid connection string is configured.`
    );
    return;
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
    await seedDatabaseIfEmpty();
  } catch (err) {
    isMongoConnected = false;
    console.log(`ℹ️  MongoDB connection offline (${err.message}). Running with in-memory store.`);
  }
};

mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  seedDatabaseIfEmpty();
});
mongoose.connection.on('error', () => {
  isMongoConnected = false;
});
mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
});

// Immediately attempt connection in background
connectDB();

// -------------------------------------------------------------
// UNIFIED DATA ACCESS LAYER (MongoDB when active, memory fallback)
// -------------------------------------------------------------

export const dbService = {
  // ---- Teams ----
  async getTeams() {
    if (isMongoConnected) {
      try {
        return await Team.find().sort({ Team_id: -1 }).lean();
      } catch (err) {
        console.warn('Mongoose getTeams error:', err.message);
      }
    }
    return memoryTeams.slice().sort((a, b) => b.Team_id - a.Team_id);
  },

  async getTeamById(id) {
    const numId = Number(id);
    if (isMongoConnected) {
      try {
        return await Team.findOne({ Team_id: numId }).lean();
      } catch (err) {
        console.warn('Mongoose getTeamById error:', err.message);
      }
    }
    return memoryTeams.find(t => t.Team_id === numId) || null;
  },

  async createTeam(data) {
    if (isMongoConnected) {
      try {
        const last = await Team.findOne().sort({ Team_id: -1 }).lean();
        const Team_id = (last?.Team_id || 0) + 1;
        const newTeam = await Team.create({
          Team_id,
          Team_name: data.Team_name,
          Coach_name: data.Coach_name || null,
          Home_ground: data.Home_ground || null,
        });
        return { message: 'Team created', Team_id: newTeam.Team_id };
      } catch (err) {
        console.warn('Mongoose createTeam error:', err.message);
      }
    }
    const Team_id = nextTeamId++;
    const newTeam = {
      Team_id,
      Team_name: data.Team_name,
      Coach_name: data.Coach_name || null,
      Home_ground: data.Home_ground || null,
    };
    memoryTeams.push(newTeam);
    return { message: 'Team created', Team_id };
  },

  async updateTeam(id, data) {
    const numId = Number(id);
    if (isMongoConnected) {
      try {
        await Team.findOneAndUpdate(
          { Team_id: numId },
          {
            Team_name: data.Team_name,
            Coach_name: data.Coach_name || null,
            Home_ground: data.Home_ground || null,
          }
        );
        return { message: 'Team updated' };
      } catch (err) {
        console.warn('Mongoose updateTeam error:', err.message);
      }
    }
    const item = memoryTeams.find(t => t.Team_id === numId);
    if (item) {
      item.Team_name = data.Team_name;
      item.Coach_name = data.Coach_name || null;
      item.Home_ground = data.Home_ground || null;
    }
    return { message: 'Team updated' };
  },

  async deleteTeam(id) {
    const numId = Number(id);
    if (isMongoConnected) {
      try {
        await Team.deleteOne({ Team_id: numId });
        await Player.updateMany({ Team_id: numId }, { Team_id: null });
        await Coach.updateMany({ Team_id: numId }, { Team_id: null });
        return { message: 'Team deleted' };
      } catch (err) {
        console.warn('Mongoose deleteTeam error:', err.message);
      }
    }
    memoryTeams = memoryTeams.filter(t => t.Team_id !== numId);
    memoryPlayers.forEach(p => { if (p.Team_id === numId) p.Team_id = null; });
    memoryCoaches.forEach(c => { if (c.Team_id === numId) c.Team_id = null; });
    return { message: 'Team deleted' };
  },

  // ---- Players ----
  async getPlayers() {
    const teams = await this.getTeams();
    const teamMap = new Map(teams.map(t => [t.Team_id, t.Team_name]));

    if (isMongoConnected) {
      try {
        const players = await Player.find().sort({ PLY_id: -1 }).lean();
        return players.map(p => ({
          ...p,
          Team_name: teamMap.get(p.Team_id) || null,
        }));
      } catch (err) {
        console.warn('Mongoose getPlayers error:', err.message);
      }
    }
    return memoryPlayers.slice().sort((a, b) => b.PLY_id - a.PLY_id).map(p => ({
      ...p,
      Team_name: teamMap.get(p.Team_id) || null,
    }));
  },

  async getPlayerById(id) {
    const numId = Number(id);
    const teams = await this.getTeams();
    const teamMap = new Map(teams.map(t => [t.Team_id, t.Team_name]));

    if (isMongoConnected) {
      try {
        const p = await Player.findOne({ PLY_id: numId }).lean();
        return p ? { ...p, Team_name: teamMap.get(p.Team_id) || null } : null;
      } catch (err) {
        console.warn('Mongoose getPlayerById error:', err.message);
      }
    }
    const p = memoryPlayers.find(pl => pl.PLY_id === numId);
    return p ? { ...p, Team_name: teamMap.get(p.Team_id) || null } : null;
  },

  async createPlayer(data) {
    const Team_id = data.Team_id ? Number(data.Team_id) : null;
    if (isMongoConnected) {
      try {
        const last = await Player.findOne().sort({ PLY_id: -1 }).lean();
        const PLY_id = (last?.PLY_id || 0) + 1;
        const newPlayer = await Player.create({
          PLY_id,
          PLY_name: data.PLY_name,
          Team_id,
          Position: data.Position || null,
        });
        return { message: 'Player created', PLY_id: newPlayer.PLY_id };
      } catch (err) {
        console.warn('Mongoose createPlayer error:', err.message);
      }
    }
    const PLY_id = nextPlayerId++;
    const newPlayer = {
      PLY_id,
      PLY_name: data.PLY_name,
      Team_id,
      Position: data.Position || null,
    };
    memoryPlayers.push(newPlayer);
    return { message: 'Player created', PLY_id };
  },

  async updatePlayer(id, data) {
    const numId = Number(id);
    const Team_id = data.Team_id ? Number(data.Team_id) : null;
    if (isMongoConnected) {
      try {
        await Player.findOneAndUpdate(
          { PLY_id: numId },
          {
            PLY_name: data.PLY_name,
            Team_id,
            Position: data.Position || null,
          }
        );
        return { message: 'Player updated' };
      } catch (err) {
        console.warn('Mongoose updatePlayer error:', err.message);
      }
    }
    const p = memoryPlayers.find(pl => pl.PLY_id === numId);
    if (p) {
      p.PLY_name = data.PLY_name;
      p.Team_id = Team_id;
      p.Position = data.Position || null;
    }
    return { message: 'Player updated' };
  },

  async deletePlayer(id) {
    const numId = Number(id);
    if (isMongoConnected) {
      try {
        await Player.deleteOne({ PLY_id: numId });
        return { message: 'Player deleted' };
      } catch (err) {
        console.warn('Mongoose deletePlayer error:', err.message);
      }
    }
    memoryPlayers = memoryPlayers.filter(p => p.PLY_id !== numId);
    return { message: 'Player deleted' };
  },

  // ---- Coaches ----
  async getCoaches() {
    const teams = await this.getTeams();
    const teamMap = new Map(teams.map(t => [t.Team_id, t.Team_name]));

    if (isMongoConnected) {
      try {
        const coaches = await Coach.find().sort({ Coach_id: -1 }).lean();
        return coaches.map(c => ({
          ...c,
          Team_name: teamMap.get(c.Team_id) || null,
        }));
      } catch (err) {
        console.warn('Mongoose getCoaches error:', err.message);
      }
    }
    return memoryCoaches.slice().sort((a, b) => b.Coach_id - a.Coach_id).map(c => ({
      ...c,
      Team_name: teamMap.get(c.Team_id) || null,
    }));
  },

  async getCoachById(id) {
    const numId = Number(id);
    const teams = await this.getTeams();
    const teamMap = new Map(teams.map(t => [t.Team_id, t.Team_name]));

    if (isMongoConnected) {
      try {
        const c = await Coach.findOne({ Coach_id: numId }).lean();
        return c ? { ...c, Team_name: teamMap.get(c.Team_id) || null } : null;
      } catch (err) {
        console.warn('Mongoose getCoachById error:', err.message);
      }
    }
    const c = memoryCoaches.find(co => co.Coach_id === numId);
    return c ? { ...c, Team_name: teamMap.get(c.Team_id) || null } : null;
  },

  async createCoach(data) {
    const Team_id = data.Team_id ? Number(data.Team_id) : null;
    const Age = data.Age ? Number(data.Age) : null;
    const Experience = data.Experience ? Number(data.Experience) : null;

    if (isMongoConnected) {
      try {
        const last = await Coach.findOne().sort({ Coach_id: -1 }).lean();
        const Coach_id = (last?.Coach_id || 0) + 1;
        const newCoach = await Coach.create({
          Coach_id,
          Coach_name: data.Coach_name,
          Team_id,
          Age,
          Experience,
        });
        return { message: 'Coach created', Coach_id: newCoach.Coach_id };
      } catch (err) {
        console.warn('Mongoose createCoach error:', err.message);
      }
    }
    const Coach_id = nextCoachId++;
    const newCoach = {
      Coach_id,
      Coach_name: data.Coach_name,
      Team_id,
      Age,
      Experience,
    };
    memoryCoaches.push(newCoach);
    return { message: 'Coach created', Coach_id };
  },

  async updateCoach(id, data) {
    const numId = Number(id);
    const Team_id = data.Team_id ? Number(data.Team_id) : null;
    const Age = data.Age ? Number(data.Age) : null;
    const Experience = data.Experience ? Number(data.Experience) : null;

    if (isMongoConnected) {
      try {
        await Coach.findOneAndUpdate(
          { Coach_id: numId },
          {
            Coach_name: data.Coach_name,
            Team_id,
            Age,
            Experience,
          }
        );
        return { message: 'Coach updated' };
      } catch (err) {
        console.warn('Mongoose updateCoach error:', err.message);
      }
    }
    const c = memoryCoaches.find(co => co.Coach_id === numId);
    if (c) {
      c.Coach_name = data.Coach_name;
      c.Team_id = Team_id;
      c.Age = Age;
      c.Experience = Experience;
    }
    return { message: 'Coach updated' };
  },

  async deleteCoach(id) {
    const numId = Number(id);
    if (isMongoConnected) {
      try {
        await Coach.deleteOne({ Coach_id: numId });
        return { message: 'Coach deleted' };
      } catch (err) {
        console.warn('Mongoose deleteCoach error:', err.message);
      }
    }
    memoryCoaches = memoryCoaches.filter(c => c.Coach_id !== numId);
    return { message: 'Coach deleted' };
  },

  // ---- Matches ----
  async getMatches() {
    const teams = await this.getTeams();
    const teamMap = new Map(teams.map(t => [t.Team_id, t.Team_name]));

    let rawMatches = [];
    let rawScores = [];

    if (isMongoConnected) {
      try {
        rawMatches = await Match.find().lean();
        rawScores = await Score.find().lean();
      } catch (err) {
        console.warn('Mongoose getMatches error:', err.message);
        rawMatches = memoryMatches;
        rawScores = memoryScores;
      }
    } else {
      rawMatches = memoryMatches;
      rawScores = memoryScores;
    }

    const scoreMap = new Map(rawScores.map(s => [s.Match_id, s]));

    return rawMatches
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(m => {
        const s = scoreMap.get(m.Match_id);
        const winnerName = s?.Win_team ? teamMap.get(s.Win_team) : null;
        return {
          ...m,
          Home_team_name: teamMap.get(m.Home_team_id) || null,
          Away_team_name: teamMap.get(m.Away_team_id) || null,
          Home_Score: s != null ? s.Home_Score : null,
          Away_Score: s != null ? s.Away_Score : null,
          Score_id: s != null ? s.Score_id : null,
          Winner_name: winnerName || null,
        };
      });
  },

  async getMatchById(id) {
    const numId = Number(id);
    const teams = await this.getTeams();
    const teamMap = new Map(teams.map(t => [t.Team_id, t.Team_name]));

    let m = null;
    if (isMongoConnected) {
      try {
        m = await Match.findOne({ Match_id: numId }).lean();
      } catch (err) {
        console.warn('Mongoose getMatchById error:', err.message);
      }
    }
    if (!m) {
      m = memoryMatches.find(ma => ma.Match_id === numId) || null;
    }

    if (!m) return null;
    return {
      ...m,
      Home_team_name: teamMap.get(m.Home_team_id) || null,
      Away_team_name: teamMap.get(m.Away_team_id) || null,
    };
  },

  async createMatch(data) {
    const Home_team_id = Number(data.Home_team_id);
    const Away_team_id = Number(data.Away_team_id);

    if (isMongoConnected) {
      try {
        const last = await Match.findOne().sort({ Match_id: -1 }).lean();
        const Match_id = (last?.Match_id || 0) + 1;
        const newMatch = await Match.create({
          Match_id,
          Ground: data.Ground || null,
          date: data.date || null,
          Home_team_id,
          Away_team_id,
        });
        return { message: 'Match created', Match_id: newMatch.Match_id };
      } catch (err) {
        console.warn('Mongoose createMatch error:', err.message);
      }
    }
    const Match_id = nextMatchId++;
    const newMatch = {
      Match_id,
      Ground: data.Ground || null,
      date: data.date || null,
      Home_team_id,
      Away_team_id,
    };
    memoryMatches.push(newMatch);
    return { message: 'Match created', Match_id };
  },

  async updateMatch(id, data) {
    const numId = Number(id);
    const Home_team_id = Number(data.Home_team_id);
    const Away_team_id = Number(data.Away_team_id);

    if (isMongoConnected) {
      try {
        await Match.findOneAndUpdate(
          { Match_id: numId },
          {
            Ground: data.Ground || null,
            date: data.date || null,
            Home_team_id,
            Away_team_id,
          }
        );
        return { message: 'Match updated' };
      } catch (err) {
        console.warn('Mongoose updateMatch error:', err.message);
      }
    }
    const m = memoryMatches.find(ma => ma.Match_id === numId);
    if (m) {
      m.Ground = data.Ground || null;
      m.date = data.date || null;
      m.Home_team_id = Home_team_id;
      m.Away_team_id = Away_team_id;
    }
    return { message: 'Match updated' };
  },

  async deleteMatch(id) {
    const numId = Number(id);
    if (isMongoConnected) {
      try {
        await Match.deleteOne({ Match_id: numId });
        await Score.deleteMany({ Match_id: numId });
        return { message: 'Match deleted' };
      } catch (err) {
        console.warn('Mongoose deleteMatch error:', err.message);
      }
    }
    memoryMatches = memoryMatches.filter(m => m.Match_id !== numId);
    memoryScores = memoryScores.filter(s => s.Match_id !== numId);
    return { message: 'Match deleted' };
  },

  // ---- Scores ----
  async getScores() {
    const teams = await this.getTeams();
    const teamMap = new Map(teams.map(t => [t.Team_id, t.Team_name]));

    let rawScores = [];
    let rawMatches = [];

    if (isMongoConnected) {
      try {
        rawScores = await Score.find().sort({ Score_id: -1 }).lean();
        rawMatches = await Match.find().lean();
      } catch (err) {
        console.warn('Mongoose getScores error:', err.message);
        rawScores = memoryScores;
        rawMatches = memoryMatches;
      }
    } else {
      rawScores = memoryScores.slice().sort((a, b) => b.Score_id - a.Score_id);
      rawMatches = memoryMatches;
    }

    const matchMap = new Map(rawMatches.map(m => [m.Match_id, m]));

    return rawScores.map(s => {
      const m = matchMap.get(s.Match_id);
      return {
        ...s,
        Ground: m?.Ground || null,
        date: m?.date || null,
        Home_team_name: m?.Home_team_id ? teamMap.get(m.Home_team_id) || null : null,
        Away_team_name: m?.Away_team_id ? teamMap.get(m.Away_team_id) || null : null,
        Winner_name: s.Win_team ? teamMap.get(s.Win_team) || null : null,
      };
    });
  },

  async createScore(data) {
    const Match_id = Number(data.Match_id);
    const Win_team = data.Win_team ? Number(data.Win_team) : null;
    const Home_Score = Number(data.Home_Score);
    const Away_Score = Number(data.Away_Score);

    if (isMongoConnected) {
      try {
        const last = await Score.findOne().sort({ Score_id: -1 }).lean();
        const Score_id = (last?.Score_id || 0) + 1;
        const newScore = await Score.create({
          Score_id,
          Match_id,
          Win_team,
          Home_Score,
          Away_Score,
        });
        return { message: 'Score recorded', Score_id: newScore.Score_id };
      } catch (err) {
        console.warn('Mongoose createScore error:', err.message);
      }
    }
    const Score_id = nextScoreId++;
    const newScore = {
      Score_id,
      Match_id,
      Win_team,
      Home_Score,
      Away_Score,
    };
    memoryScores.push(newScore);
    return { message: 'Score recorded', Score_id };
  },

  async updateScore(id, data) {
    const numId = Number(id);
    const Win_team = data.Win_team ? Number(data.Win_team) : null;
    const Home_Score = Number(data.Home_Score);
    const Away_Score = Number(data.Away_Score);

    if (isMongoConnected) {
      try {
        await Score.findOneAndUpdate(
          { Score_id: numId },
          {
            Win_team,
            Home_Score,
            Away_Score,
          }
        );
        return { message: 'Score updated' };
      } catch (err) {
        console.warn('Mongoose updateScore error:', err.message);
      }
    }
    const s = memoryScores.find(sc => sc.Score_id === numId);
    if (s) {
      s.Win_team = Win_team;
      s.Home_Score = Home_Score;
      s.Away_Score = Away_Score;
    }
    return { message: 'Score updated' };
  },

  async deleteScore(id) {
    const numId = Number(id);
    if (isMongoConnected) {
      try {
        await Score.deleteOne({ Score_id: numId });
        return { message: 'Score deleted' };
      } catch (err) {
        console.warn('Mongoose deleteScore error:', err.message);
      }
    }
    memoryScores = memoryScores.filter(s => s.Score_id !== numId);
    return { message: 'Score deleted' };
  },

  isOnline() {
    return isMongoConnected;
  }
};

export default dbService;
