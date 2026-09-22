import express from 'express';
import { dbService } from '../config/db.js';

const router = express.Router();

// GET all coaches with team name
router.get('/', async (req, res) => {
  try {
    const coaches = await dbService.getCoaches();
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single coach
router.get('/:id', async (req, res) => {
  try {
    const coach = await dbService.getCoachById(req.params.id);
    if (!coach) return res.status(404).json({ error: 'Coach not found' });
    res.json(coach);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create coach
router.post('/', async (req, res) => {
  const { Coach_name, Team_id, Age, Experience } = req.body;
  if (!Coach_name) return res.status(400).json({ error: 'Coach_name is required' });
  try {
    const result = await dbService.createCoach({ Coach_name, Team_id, Age, Experience });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update coach
router.put('/:id', async (req, res) => {
  const { Coach_name, Team_id, Age, Experience } = req.body;
  try {
    const result = await dbService.updateCoach(req.params.id, { Coach_name, Team_id, Age, Experience });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE coach
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbService.deleteCoach(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
