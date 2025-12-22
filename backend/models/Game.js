import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    coverImage: {
      type: String,
      default: '/default-game-cover.png',
    },

    coverImagePublicId: {
      type: String,
      default: null,
    },

    genres: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    maxPlayers: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Game = mongoose.model('Game', gameSchema);

export default Game;
