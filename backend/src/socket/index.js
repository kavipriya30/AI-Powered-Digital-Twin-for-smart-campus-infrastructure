/**
 * Socket.io Configuration
 * Handles real-time communication for the digital twin
 */

import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join rooms
    socket.on('join:campus', () => {
      socket.join('campus');
      console.log(`Client ${socket.id} joined campus room`);
    });

    socket.on('join:building', (buildingId) => {
      socket.join(`building:${buildingId}`);
      console.log(`Client ${socket.id} joined building:${buildingId}`);
    });

    socket.on('join:alerts', () => {
      socket.join('alerts');
      console.log(`Client ${socket.id} joined alerts room`);
    });

    socket.on('join:energy', () => {
      socket.join('energy');
      console.log(`Client ${socket.id} joined energy room`);
    });

    socket.on('join:sensors', () => {
      socket.join('sensors');
      console.log(`Client ${socket.id} joined sensors room`);
    });

    // Leave rooms
    socket.on('leave:campus', () => {
      socket.leave('campus');
    });

    socket.on('leave:building', (buildingId) => {
      socket.leave(`building:${buildingId}`);
    });

    // Handle custom events
    socket.on('subscribe:sensor', (sensorId) => {
      socket.join(`sensor:${sensorId}`);
    });

    socket.on('unsubscribe:sensor', (sensorId) => {
      socket.leave(`sensor:${sensorId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Emit functions for different event types
export const emitSensorUpdate = (sensorId, data) => {
  if (io) {
    io.to(`sensor:${sensorId}`).to('sensors').to('campus').emit('sensor:update', { sensorId, data });
  }
};

export const emitBuildingUpdate = (buildingId, data) => {
  if (io) {
    io.to(`building:${buildingId}`).to('campus').emit('building:update', { buildingId, data });
  }
};

export const emitAlert = (alert) => {
  if (io) {
    io.to('alerts').to('campus').emit('alert:new', alert);
  }
};

export const emitEnergyUpdate = (data) => {
  if (io) {
    io.to('energy').to('campus').emit('energy:update', data);
  }
};

export const emitPrediction = (prediction) => {
  if (io) {
    io.to('campus').emit('prediction:new', prediction);
  }
};

export const emitCampusUpdate = (data) => {
  if (io) {
    io.to('campus').emit('campus:update', data);
  }
};

export const emitEmergencyAlert = (emergency) => {
  if (io) {
    io.to('campus').to('alerts').emit('emergency:alert', emergency);
  }
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export default io;
