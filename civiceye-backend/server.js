const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Import the User model you created earlier
const verifyToken = require('./middleware/auth');
const { upload } = require('./config/cloudinary');
const Complaint = require('./models/Complaint'); // Make sure this is imported!
const Department = require('./models/Department');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware MUST come before routes
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civiceye';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas/Local successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Your test route
app.post('/api/departments', async (req, res) => {
  try {
    const newDepartment = new Department(req.body);
    const savedDepartment = await newDepartment.save();
    res.status(201).json(savedDepartment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// 1. Register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, ward } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the new user
    user = new User({
      name,
      email,
      passwordHash,
      role: role || 'citizen',
      ward
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Login an existing user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ==========================================
// COMPLAINT ROUTES
// ==========================================

// Create a new complaint (Citizen)
app.post('/api/complaints', verifyToken, upload.single('image'), async (req, res) => {
  try {
    // 1. Extract text data from the request
    const { title, description, latitude, longitude, address, ward } = req.body;
    
    // 2. Ensure an image was actually uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'An image is required.' });
    }

    // 3. MOCK AI PIPELINE (Member 3 will replace this later)
    // We mock this data so you can verify your database structure works perfectly today.
    const mockAiAnalysis = {
      detectedIssue: "Garbage Dumping",
      confidence: 94,
      severity: "HIGH",
      suggestedDepartment: "Health & Sanitation",
      reasoning: "Large waste accumulation near a residential/public area."
    };
    const mockPriorityScore = 87; // Deterministic score placeholder

    // 4. Generate a unique CivicEye ID (e.g., CE-1042)
    const complaintCount = await Complaint.countDocuments();
    const complaintId = `CE-${1000 + complaintCount + 1}`;

    // 5. Build and save the Complaint document
    const newComplaint = new Complaint({
      complaintId: complaintId,
      citizenId: req.user.userId, // Pulled securely from the JWT token!
      title: title,
      description: description,
      imageUrl: req.file.path, // This is the clean Cloudinary URL!
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        address: address,
        ward: ward
      },
      aiAnalysis: mockAiAnalysis,
      priorityScore: mockPriorityScore,
      status: 'AI Classified'
    });

    const savedComplaint = await newComplaint.save();
    
    // 6. Return the success response
    res.status(201).json(savedComplaint);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});// Get a citizen's own complaints
app.get('/api/complaints/my', verifyToken, async (req, res) => {
  try {
    // req.user.userId comes from your verifyToken middleware!
    const complaints = await Complaint.find({ citizenId: req.user.userId })
      .sort({ createdAt: -1 }); // Sorts by newest first
    
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/', (req, res) => {
  res.send('CivicEye Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});