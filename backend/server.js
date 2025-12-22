import 'dotenv/config.js';
import http from 'http';
import app from './app.js';
import connectDB from './configs/db.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server');
    console.error(err);
  }
}

startServer();
