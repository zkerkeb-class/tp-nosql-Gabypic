import express from 'express';
import Pokemon from '../models/pokemon.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [byType, maxAttack, maxHP] = await Promise.all([
      Pokemon.aggregate([
        { $unwind: '$type' },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            avgHP: { $avg: '$base.HP' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Pokemon.aggregate([
        {
          $project: {
            id: 1,
            name: 1,
            'base.Attack': 1,
          },
        },
        { $sort: { 'base.Attack': -1 } },
        { $limit: 1 },
      ]),
      Pokemon.aggregate([
        {
          $project: {
            id: 1,
            name: 1,
            'base.HP': 1,
          },
        },
        { $sort: { 'base.HP': -1 } },
        { $limit: 1 },
      ]),
    ]);

    return res.status(200).json({
      byType: byType.map((t) => ({
        type: t._id,
        count: t.count,
        avgHP: t.avgHP,
      })),
      maxAttack: maxAttack[0] ?? null,
      maxHP: maxHP[0] ?? null,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

