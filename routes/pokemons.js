import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const pokemonsList = req.app.locals.pokemonsList ?? [];
  return res.status(200).json(pokemonsList);
});

router.get('/:id', (req, res) => {
  const pokemonsList = req.app.locals.pokemonsList ?? [];
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(404).json({ error: 'Pokemon not found' });
  }

  const pokemon = pokemonsList.find((p) => p.id === id);
  if (!pokemon) {
    return res.status(404).json({ error: 'Pokemon not found' });
  }

  return res.status(200).json(pokemon);
});

export default router;
