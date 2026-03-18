// Charger les variables d'environnement en PREMIER (avant tout autre import)
// dotenv lit le fichier .env et rend les variables accessibles via process.env
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import pokemonsList from './data/pokemonsList.js';
import pokemonsRouter from './routes/pokemons.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';
import statsRouter from './routes/stats.js';
import teamsRouter from './routes/teams.js';
import connectDB from './db/connect.js';

const app = express();

app.use(cors()); // Permet les requêtes cross-origin (ex: frontend sur un autre port)
app.use(express.json());

app.use(express.static('public')); // Sert l'UI front (index.html, JS, CSS)
app.use('/assets', express.static('assets')); // Permet d'accéder aux fichiers dans le dossier "assets" via l'URL /assets/...

app.locals.pokemonsList = pokemonsList;

app.use('/api/pokemons', pokemonsRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/teams', teamsRouter);

const startServer = async () => {
    await connectDB();

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
    });
};

startServer();