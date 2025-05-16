const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increase JSON payload limit to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Handle URL-encoded data

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG/PNG images are allowed"));
  },
});

// MongoDB Schema
const propertySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  beds: { type: Number, required: true },
  baths: { type: Number, required: true },
  imageDesc: { type: String, default: "" },
  imageUrl: { type: String },
  approved: { type: Boolean, default: false },
});
const Property = mongoose.model("Property", propertySchema, "test");


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Message Schema for Contact Landlord
const messageSchema = new mongoose.Schema({
  propertyId: { type: Number, required: true },
  propertyTitle: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String },
  message: { type: String, required: true },
  status: { type: String, default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});
const UserMessage = mongoose.model("UserMessage", messageSchema, "user msg");

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user data (excluding password)
    res.json({ message: "Login successful", name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Routes
app.get("/api/properties", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/properties/:id", async (req, res) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/api/properties", upload.single("image"), async (req, res) => {
  try {
    const { id, title, state, city, location, price, beds, baths, imageDesc } = req.body;
    if (!id || !title || !state || !city || !location || !price || !beds || !baths) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || "https://via.placeholder.com/400x300";
    const property = new Property({
      id,
      title,
      state,
      city,
      location,
      price: parseFloat(price),
      beds: parseInt(beds),
      baths: parseInt(baths),
      imageDesc: imageDesc || "",
      imageUrl,
    });
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "Property with this ID already exists" });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

app.put("/api/properties/:id", async (req, res) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/properties/:id", async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve property endpoint
app.put("/api/properties/:id/approve", async (req, res) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    property.approved = true;
    await property.save();
    res.json({ message: "Property approved", property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/messages - Store a new message
app.post("/api/messages", async (req, res) => {
  try {
    const { propertyId, propertyTitle, userName, userEmail, userPhone, message } = req.body;
    if (!propertyId || !propertyTitle || !userName || !userEmail || !message) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    const newMsg = new UserMessage({
      propertyId,
      propertyTitle,
      userName,
      userEmail,
      userPhone,
      message
    });
    await newMsg.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages - Get all messages grouped by property
app.get("/api/messages", async (req, res) => {
  try {
    const messages = await UserMessage.find().sort({ timestamp: -1 });
    // Group by propertyId
    const grouped = {};
    messages.forEach(msg => {
      if (!grouped[msg.propertyId]) {
        grouped[msg.propertyId] = {
          propertyTitle: msg.propertyTitle,
          propertyId: msg.propertyId,
          messages: []
        };
      }
      grouped[msg.propertyId].messages.push({
        userName: msg.userName,
        userEmail: msg.userEmail,
        userPhone: msg.userPhone,
        message: msg.message,
        status: msg.status,
        _id: msg._id,
        timestamp: msg.timestamp
      });
    });
    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve a specific user request
app.put('/api/messages/:id/approve', async (req, res) => {
  try {
    const msg = await UserMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: 'Request not found' });
    }
    msg.status = 'approved';
    await msg.save();
    res.json({ message: 'Request approved', msg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/RENTAL", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
