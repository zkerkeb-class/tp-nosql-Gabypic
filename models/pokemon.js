import mongoose from 'mongoose';

const ALLOWED_TYPES = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
];

const statField = (label) => ({
  type: Number,
  required: [true, `${label} est requis`],
  min: [1, `${label} doit être au minimum 1`],
  max: [255, `${label} doit être au maximum 255`],
});

const optionalStatField = (label) => ({
  type: Number,
  min: [1, `${label} doit être au minimum 1`],
  max: [255, `${label} doit être au maximum 255`],
});

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'L’identifiant est requis'],
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: 'L’identifiant doit être un entier',
    },
    min: [1, 'L’identifiant doit être un entier positif'],
  },
  name: {
    english: {
      type: String,
      required: [true, 'Le nom anglais est requis'],
    },
    french: {
      type: String,
      required: [true, 'Le nom français est requis'],
    },
    japanese: { type: String },
    chinese: { type: String },
  },
  type: {
    type: [String],
    required: [true, 'Au moins un type est requis'],
    enum: {
      values: ALLOWED_TYPES,
      message: 'Type "{VALUE}" invalide',
    },
  },
  base: {
    HP: statField('HP'),
    Attack: statField('Attack'),
    Defense: statField('Defense'),
    SpecialAttack: optionalStatField('SpecialAttack'),
    SpecialDefense: optionalStatField('SpecialDefense'),
    Speed: optionalStatField('Speed'),
  },
  image: {
    type: String,
  },
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;

