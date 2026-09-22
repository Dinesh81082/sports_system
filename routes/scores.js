import express from 'express';
import { dbService } from '../config/db.js';

const router = express.Router();

// GET all scores with match & team details
router.get('/', async (req, res) => {
  try {
    const scores = await dbService.getScores();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create score
router.post('/', async (req, res) => {
  const { Match_id, Win_team, Home_Score, Away_Score } = req.body;
  if (!Match_id) return res.status(400).json({ error: 'Match_id is required' });
  try {
    const result = await dbService.createScore({ Match_id, Win_team, Home_Score, Away_Score });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update score
router.put('/:id', async (req, res) => {
  const { Win_team, Home_Score, Away_Score } = req.body;
  try {
    const result = await dbService.updateScore(req.params.id, { Win_team, Home_Score, Away_Score });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE score
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbService.deleteScore(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
