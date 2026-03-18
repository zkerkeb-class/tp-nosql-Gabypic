import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  pokemons: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon',
      },
    ],
    default: [],
  },
});

teamSchema.pre('save', function validateSize() {
  if (this.pokemons.length > 6) {
    throw new Error('Une équipe ne peut pas contenir plus de 6 Pokémon');
  }
});

const Team = mongoose.model('Team', teamSchema);

export default Team;

