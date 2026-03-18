import express from 'express';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { type, name, sort } = req.query;

    const page = Math.max(1, Number.parseInt(req.query.page ?? '1', 10) || 1);
    const limit = Math.max(1, Number.parseInt(req.query.limit ?? '50', 10) || 50);
    const skip = (page - 1) * limit;

    const filter = {};

    if (typeof type === 'string' && type.trim() !== '') {
      filter.type = type.trim();
    }

    if (typeof name === 'string' && name.trim() !== '') {
      filter['name.english'] = { $regex: name.trim(), $options: 'i' };
    }

    const [data, total] = await Promise.all([
      Pokemon.find(filter)
        .sort(typeof sort === 'string' && sort.trim() !== '' ? sort.trim() : undefined)
        .skip(skip)
        .limit(limit),
      Pokemon.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      data,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    const pokemon = await Pokemon.findOne({ id });
    if (!pokemon) return res.status(404).json({ error: 'Pokémon non trouvé' });

    return res.status(200).json(pokemon);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const created = await Pokemon.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    const updated = await Pokemon.findOneAndUpdate({ id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Pokémon non trouvé' });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(404).json({ error: 'Pokémon non trouvé' });
    }

    const deleted = await Pokemon.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ error: 'Pokémon non trouvé' });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
