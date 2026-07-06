/**
 * Server Entry Point
 * Starts the Express server with Socket.io
 */

import app from './src/app.js';
import connectDB from './src/config/db.js';
import { initializeSocket } from './src/socket/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create HTTP server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Campus Digital Twin API Server                          ║
║   Running on port: ${process.env.PORT || 5000}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Initialize Socket.io
initializeSocket(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Error:', err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});
