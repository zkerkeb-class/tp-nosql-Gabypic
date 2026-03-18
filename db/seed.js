import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './connect.js';
import Pokemon from '../models/pokemon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async () => {
  try {
    await connectDB();

    const filePath = path.join(__dirname, '..', 'data', 'pokemons.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const pokemons = JSON.parse(rawData);

    await Pokemon.deleteMany({});
    console.log('Collection vidée.');

    const inserted = await Pokemon.insertMany(pokemons);
    console.log(`${inserted.length} Pokémon insérés avec succès !`);
  } catch (error) {
    console.error('Erreur lors du seed :', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée.');
  }
};

seed();

