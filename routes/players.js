import express from 'express';
import { dbService } from '../config/db.js';

const router = express.Router();

// GET all players with team name
router.get('/', async (req, res) => {
  try {
    const players = await dbService.getPlayers();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single player
router.get('/:id', async (req, res) => {
  try {
    const player = await dbService.getPlayerById(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create player
router.post('/', async (req, res) => {
  const { PLY_name, Team_id, Position } = req.body;
  if (!PLY_name) return res.status(400).json({ error: 'PLY_name is required' });
  try {
    const result = await dbService.createPlayer({ PLY_name, Team_id, Position });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update player
router.put('/:id', async (req, res) => {
  const { PLY_name, Team_id, Position } = req.body;
  try {
    const result = await dbService.updatePlayer(req.params.id, { PLY_name, Team_id, Position });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE player
router.delete('/:id', async (req, res) => {
  try {
    const result = await dbService.deletePlayer(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
