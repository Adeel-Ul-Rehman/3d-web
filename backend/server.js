import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

// Enable CORS for frontend development
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use(express.json())

// Root status endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the 3D Web App Backend API Service',
    docs: '/api/health'
  })
})

// Detailed health status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Backend is fully operational and connected!',
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'development',
    memoryUsage: process.memoryUsage()
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
