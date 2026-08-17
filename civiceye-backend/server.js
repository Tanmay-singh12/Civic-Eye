const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Complaint = require("./models/Complaint");
const Department = require("./models/Department");

const verifyToken = require("./middleware/auth");
const { upload } = require("./config/cloudinary");

const app = express();
const PORT = process.env.PORT || 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(cors());


// ==========================================
// MONGODB CONNECTION
// ==========================================

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/civiceye";


// ==========================================
// DEPARTMENT
// ==========================================

app.post("/api/departments", async (req, res) => {
  try {
    const newDepartment = new Department(req.body);

    const savedDepartment = await newDepartment.save();

    res.status(201).json(savedDepartment);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});


// ==========================================
// AUTHENTICATION
// ==========================================

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      ward,
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(
      password,
      salt
    );

    // Create user
    const user = new User({
      name,
      email,
      passwordHash,
      role: role || "citizen",
      ward,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully!",
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Find user
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      userId: user._id,
      role: user.role,
      name: user.name,
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// ==========================================
// COMPLAINTS
// ==========================================

// CREATE COMPLAINT
app.post(
  "/api/complaints",
  verifyToken,
  upload.single("image"),
  async (req, res) => {

    try {

      const {
        title,
        description,
        latitude,
        longitude,
        address,
        ward,
      } = req.body;


      // Image required
      if (!req.file) {
        return res.status(400).json({
          message: "An image is required.",
        });
      }


      // ======================================
      // TEMPORARY AI RESULT
      // ======================================

      const mockAiAnalysis = {

        detectedIssue: "Garbage Dumping",

        confidence: 94,

        severity: "HIGH",

        suggestedDepartment:
          "Health & Sanitation",

        reasoning:
          "Large waste accumulation near a residential/public area.",
      };


      const mockPriorityScore = 87;


      // ======================================
      // CIVICEYE ID
      // ======================================

      const complaintCount =
        await Complaint.countDocuments();

      const complaintId =
        `CE-${1000 + complaintCount + 1}`;


      // ======================================
      // CREATE COMPLAINT
      // ======================================

      const newComplaint = new Complaint({

        complaintId,

        citizenId: req.user.userId,

        title,

        description,

        imageUrl: req.file.path,

        location: {

          latitude: Number(latitude),

          longitude: Number(longitude),

          address,

          ward,
        },

        aiAnalysis: mockAiAnalysis,

        priorityScore: mockPriorityScore,

        status: "AI Classified",
      });


      const savedComplaint =
        await newComplaint.save();


      res.status(201).json(savedComplaint);

    } catch (error) {

      console.error(
        "Complaint creation error:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  }
);


// ==========================================
// GET MY COMPLAINTS
// ==========================================

app.get(
  "/api/complaints/my",
  verifyToken,
  async (req, res) => {

    try {

      const complaints =
        await Complaint.find({
          citizenId: req.user.userId,
        })
        .sort({
          createdAt: -1,
        });


      res.status(200).json(complaints);

    } catch (error) {

      res.status(500).json({
        error: error.message,
      });
    }
  }
);


// ==========================================
// GET SINGLE COMPLAINT
// ==========================================

app.get(
  "/api/complaints/:id",
  verifyToken,
  async (req, res) => {

    try {

      const complaint =
        await Complaint.findOne({

          _id: req.params.id,

          citizenId: req.user.userId,

        });


      if (!complaint) {

        return res.status(404).json({

          message: "Complaint not found",

        });

      }


      res.status(200).json(complaint);

    } catch (error) {

      console.error(
        "Get complaint error:",
        error
      );

      res.status(500).json({

        error: error.message,

      });
    }
  }
);


// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

app.get(
  "/api/dashboard/stats",
  verifyToken,
  async (req, res) => {

    try {

      const totalComplaints =
        await Complaint.countDocuments();


      const pending =
        await Complaint.countDocuments({

          status: {
            $in: [
              "Submitted",
              "AI Classified",
              "Assigned",
              "In Progress",
            ],
          },

        });


      const resolved =
        await Complaint.countDocuments({

          status: "Resolved",

        });


      res.status(200).json({

        total: totalComplaints,

        pending,

        resolved,

      });

    } catch (error) {

      res.status(500).json({

        error: error.message,

      });
    }
  }
);


// ==========================================
// UPDATE COMPLAINT STATUS
// ==========================================

app.patch(
  "/api/complaints/:id/status",
  verifyToken,
  async (req, res) => {

    try {

      const {
        status,
        assignedDepartment,
        resolutionComment,
      } = req.body;


      const updateData = {};


      if (status) {

        updateData.status = status;

      }


      if (assignedDepartment) {

        updateData.assignedDepartment =
          assignedDepartment;

      }


      if (status === "Resolved") {

        updateData["resolution.comment"] =
          resolutionComment ||
          "Marked resolved by official.";

      }


      const updatedComplaint =
        await Complaint.findByIdAndUpdate(

          req.params.id,

          {
            $set: updateData,
          },

          {
            new: true,
          }
        );


      if (!updatedComplaint) {

        return res.status(404).json({

          message: "Complaint not found",

        });

      }


      res.status(200).json({

        message:
          "Complaint updated successfully!",

        complaint: updatedComplaint,

      });

    } catch (error) {

      res.status(500).json({

        error: error.message,

      });
    }
  }
);


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

  res.send(
    "CivicEye Backend is running!"
  );

});


// ==========================================
// START SERVER
// ==========================================

async function startServer() {

  try {

    await mongoose.connect(MONGO_URI);

    console.log(
      "Connected to MongoDB successfully!"
    );


    app.listen(PORT, () => {

      console.log(
        `Server is running on port ${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);

  }
}


startServer();