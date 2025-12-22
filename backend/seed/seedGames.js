import 'dotenv/config.js';
import connectDB from '../configs/db.js';
import Game from '../models/Game.js';
import { games } from './data/games.js';

async function seedGames() {
  try {
    await connectDB();

    console.log('🌱 Seeding games...');

    // Clear existing games (safe for dev/testing)
    await Game.deleteMany({});

    const insertedGames = await Game.insertMany(games);

    console.log(`✅ Seeded ${insertedGames.length} games`);
    insertedGames.forEach((game) =>
      console.log(`- ${game.title} (${game.maxPlayers} players)`)
    );

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedGames();
