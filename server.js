require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Lead = require('./models/Lead');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware — CORS allows your frontend domain to call this API
// Set FRONTEND_URL in .env for production (e.g. https://makewinningads.com)
// If not set, allows all origins (fine for development)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Health check — visit /api/health to verify backend is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'Pappu', timestamp: new Date().toISOString() });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cdltechsolutions163_db_user:XARTupygnMNnxYGs@chronicpains.oqjkifb.mongodb.net/makewinningads')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/leads', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    const savedLead = await lead.save();
    res.status(201).json({ success: true, contact_id: savedLead._id });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET all leads for Admin Dashboard
app.get('/api/leads', async (req, res) => {
  try {
    // Basic security: require a secret key
    const secret = req.query.secret;
    const adminSecret = process.env.ADMIN_SECRET || 'adblend2026';
    
    if (secret !== adminSecret) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.post('/api/leads/:id/appointment', async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, appointmentTimezone } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { appointmentDate, appointmentTime, appointmentTimezone },
      { new: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, lead });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
