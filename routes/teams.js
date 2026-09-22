import express from 'express';
import { dbService } from '../config/db.js';

const router = express.Router();

// GET all teams
router.get('/', async (req, res) => {
  try {
    const teams = await dbService.getTeams();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single team
router.get('/:id', async (req, res) => {
  try {
    const team = await dbService.getTeamById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create team
router.post('/', async (req, res) => {
  const { Team_name, Coach_name, Home_ground } = req.body;
  if (!Team_name) return res.status(400).json({ error: 'Team_name is required' });
  try {
    const result = await dbService.createTeam({ Team_name, Coach_name, Home_ground });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update team
router.put('/:id', async (req, res) => {
  const { Team_name, Coach_name, Home_ground } = req.body;
  try {
    const result = await dbService.updateTeam(req.params.id, { Team_name, Coach_name, Home_ground });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE team
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbService.deleteTeam(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
