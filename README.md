# AI-Powered Digital Twin for Smart Campus Infrastructure

A comprehensive full-stack system that creates a real-time AI-powered Digital Twin of a smart campus. It monitors infrastructure, predicts failures, optimizes energy usage, tracks crowd movement, and improves safety using AI analytics.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │Dashboard│ │Buildings │ │Sensors  │ │Energy   │ │Security │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP + WebSocket
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express)                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │Auth API │ │Buildings│ │Sensors  │ │Energy   │ │Alerts   │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│                           │                                     │
│                    ┌──────┴──────┐                             │
│                    │ Socket.io   │ (Real-time)                 │
│                    └─────────────┘                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
         ┌──────────┐  ┌──────────┐    ┌──────────┐
         │ MongoDB  │  │ AI Service│    │ External │
         │          │  │(FastAPI)  │    │ APIs     │
         └──────────┘  └──────────┘    └──────────┘
```

## 🚀 Features

### Core Features
- **3D Digital Twin Dashboard** - Interactive 3D campus visualization with Three.js
- **Smart Infrastructure Monitoring** - Real-time tracking of electricity, water, HVAC, elevators
- **AI-Based Predictive Maintenance** - ML-powered equipment failure predictions
- **Smart Energy Optimization** - AI suggestions for energy savings
- **Crowd Density Heatmap** - Real-time occupancy visualization
- **Smart Security System** - AI anomaly detection and alerts
- **Emergency Response Simulation** - Fire, flood, earthquake simulations
- **Sustainability Dashboard** - Carbon footprint and environmental metrics

### Advanced Features
- **AI Chat Assistant** - Natural language campus insights
- **Smart Space Utilization AI** - Classroom allocation optimization
- **IoT Data Simulator** - Random sensor data generation
- **Role-Based Access Control** - Admin, Maintenance, Energy Manager, Security roles
- **Real-Time Alert System** - WebSocket-powered instant notifications

## 📋 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Vite, Tailwind CSS, Recharts, Three.js, Leaflet |
| Backend | Node.js, Express.js, MongoDB, Socket.io, JWT |
| AI/ML | Python, FastAPI, TensorFlow, scikit-learn |
| Real-time | Socket.io |

## 🛠️ Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB (v6+)
- npm or yarn

## 📦 Installation

### 1. Clone the Repository
```
bash
cd campus-digital-twin
```

### 2. Backend Setup

```
bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/campus_digital_twin
# JWT_SECRET=your-secret-key
# PORT=5000

# Start the server
npm run dev
```

### 3. Frontend Setup

```
bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. AI Service Setup (Optional)

```
bash
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start AI service
python prediction_api.py
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```
env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campus_digital_twin
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables
Create `.env` in frontend directory:
```
env
VITE_API_URL=http://localhost:5000
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Buildings
- `GET /api/buildings` - Get all buildings
- `GET /api/buildings/:id` - Get building details
- `GET /api/buildings/overview` - Get campus overview

### Sensors
- `GET /api/sensors` - Get all sensors
- `GET /api/sensors/:id` - Get sensor details
- `PUT /api/sensors/:id/readings` - Update sensor reading

### Energy
- `GET /api/energy` - Get energy logs
- `GET /api/energy/summary` - Get energy summary
- `GET /api/energy/optimization` - Get AI optimization tips

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/acknowledge` - Acknowledge alert
- `PUT /api/alerts/:id/resolve` - Resolve alert

### Predictions
- `GET /api/predictions/maintenance` - Get maintenance predictions
- `GET /api/predictions/energy` - Get energy predictions
- `GET /api/predictions/anomalies` - Get anomaly detections

## 🔌 WebSocket Events

### Server → Client
- `sensor:update` - Real-time sensor data
- `building:update` - Building status changes
- `alert:new` - New alert notification
- `energy:update` - Energy consumption updates
- `prediction:new` - New AI prediction
- `campus:update` - General campus updates

### Client → Server
- `join:campus` - Join campus room
- `join:building` - Join building room
- `join:alerts` - Join alerts room
- `subscribe:sensor` - Subscribe to sensor updates

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full access to all features |
| Maintenance | View sensors, alerts, predictions |
| Energy Manager | View energy, predictions |
| Security | View security, alerts |
| Viewer | Read-only access |

## 📁 Project Structure

```
campus-digital-twin/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/      # Auth, role middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── socket/         # Socket.io handlers
│   │   └── app.js          # Express app
│   ├── package.json
│   └── server.js           # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── layout/    # Layout components
│   │   ├── context/       # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API & socket services
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── ai-service/
│   ├── prediction_api.py   # FastAPI service
│   └── requirements.txt
│
└── README.md
```

## 🧪 Testing

### Backend Tests
```
bash
cd backend
npm test
```

### Frontend Tests
```
bash
cd frontend
npm test
```

## 📊 Demo Data

The application includes mock data for demonstration:
- 8 campus buildings with health metrics
- 50+ IoT sensors (temperature, humidity, energy, etc.)
- Historical energy consumption data
- Sample alerts and predictions

### Demo Credentials
```
Email: admin@campus.edu
Password: admin123
```

## 🔨 Building for Production

### Frontend
```
bash
cd frontend
npm run build
```

### Backend
```
bash
cd backend
npm run build  # If using TypeScript
```

## 🚀 Deployment

### Using Docker (Recommended)

```
bash
# Create Dockerfile for backend
# Create Dockerfile for frontend
# Use nginx for serving frontend

docker-compose up -d
```

### Manual Deployment

1. **Build frontend**: `npm run build`
2. **Start backend**: `npm start`
3. **Configure reverse proxy** (nginx)
4. **Set up MongoDB Atlas** for cloud database

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Three.js for 3D visualization
- Recharts for data visualization
- Leaflet for maps
- Socket.io for real-time communication

## 📞 Support

For support, email support@campus.edu or join our Discord channel.

---

Built with ❤️ for Smart Campus Infrastructure
