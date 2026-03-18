import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import Team from '../models/team.js';
import Pokemon from '../models/pokemon.js';

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const { name, pokemons = [] } = req.body ?? {};

    if (!name) {
      return res.status(400).json({ error: 'Le nom de l’équipe est requis' });
    }
    if (!Array.isArray(pokemons) || pokemons.length > 6) {
      return res
        .status(400)
        .json({ error: 'Une équipe doit contenir entre 0 et 6 Pokémon' });
    }

    const pokemonDocs = await Pokemon.find({ id: { $in: pokemons } });
    const idsByNumber = new Map(pokemonDocs.map((p) => [p.id, p._id]));
    const pokemonObjectIds = pokemons
      .map((num) => idsByNumber.get(num))
      .filter(Boolean);

    const team = await Team.create({
      user: req.user.id,
      name,
      pokemons: pokemonObjectIds,
    });

    const populated = await team.populate('pokemons');
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({ user: req.user.id }).populate('pokemons');
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('pokemons');

    if (!team) return res.status(404).json({ error: 'Équipe non trouvée' });

    return res.status(200).json(team);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, pokemons } = req.body ?? {};

    const update = {};

    if (typeof name === 'string') {
      update.name = name;
    }

    if (Array.isArray(pokemons)) {
      if (pokemons.length > 6) {
        return res
          .status(400)
          .json({ error: 'Une équipe doit contenir au maximum 6 Pokémon' });
      }
      const pokemonDocs = await Pokemon.find({ id: { $in: pokemons } });
      const idsByNumber = new Map(pokemonDocs.map((p) => [p.id, p._id]));
      update.pokemons = pokemons
        .map((num) => idsByNumber.get(num))
        .filter(Boolean);
    }

    const team = await Team.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      update,
      { new: true },
    ).populate('pokemons');

    if (!team) return res.status(404).json({ error: 'Équipe non trouvée' });

    return res.status(200).json(team);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Team.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: 'Équipe non trouvée' });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

