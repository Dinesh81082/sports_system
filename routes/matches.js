import express from 'express';
import { dbService } from '../config/db.js';

const router = express.Router();

// GET all matches with team names and scores
router.get('/', async (req, res) => {
  try {
    const matches = await dbService.getMatches();
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single match
router.get('/:id', async (req, res) => {
  try {
    const match = await dbService.getMatchById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create match
router.post('/', async (req, res) => {
  const { Ground, date, Home_team_id, Away_team_id } = req.body;
  if (!Home_team_id || !Away_team_id) return res.status(400).json({ error: 'Both team IDs required' });
  try {
    const result = await dbService.createMatch({ Ground, date, Home_team_id, Away_team_id });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update match
router.put('/:id', async (req, res) => {
  const { Ground, date, Home_team_id, Away_team_id } = req.body;
  try {
    const result = await dbService.updateMatch(req.params.id, { Ground, date, Home_team_id, Away_team_id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE match
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbService.deleteMatch(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
