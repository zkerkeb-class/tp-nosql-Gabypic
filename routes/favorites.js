import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/user.js';
import Pokemon from '../models/pokemon.js';

const router = express.Router();

router.use(auth);

router.post('/:pokemonId', async (req, res) => {
  try {
    const pokemonId = Number.parseInt(req.params.pokemonId, 10);
    if (Number.isNaN(pokemonId)) {
      return res.status(400).json({ error: 'ID de Pokémon invalide' });
    }

    const pokemonExists = await Pokemon.exists({ id: pokemonId });
    if (!pokemonExists) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { favorites: pokemonId } },
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:pokemonId', async (req, res) => {
  try {
    const pokemonId = Number.parseInt(req.params.pokemonId, 10);
    if (Number.isNaN(pokemonId)) {
      return res.status(400).json({ error: 'ID de Pokémon invalide' });
    }

    await User.updateOne(
      { _id: req.user.id },
      { $pull: { favorites: pokemonId } },
    );

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: 'Non autorisé' });

    const favorites = await Pokemon.find({ id: { $in: user.favorites } });
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

