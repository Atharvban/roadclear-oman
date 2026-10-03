import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

// Standard ES module workaround for __dirname in Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Dynamic Port Binding for Render
const PORT = process.env.PORT || 5001;

// 2. Explicit CORS Setup
app.use(cors({
  origin: '*', // Allows requests from your Render frontend static site
  methods: ['GET', 'POST'],
  credentials: true
}));

// In-memory array to store enriched reports
const reports = [];

// Ensure the 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration: restrict to images & max 5MB
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware for parsing requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve uploads folder
app.use('/uploads', express.static(uploadDir));

// Serve static assets from public/ if present
if (fs.existsSync(path.join(__dirname, 'public'))) {
  app.use(express.static(path.join(__dirname, 'public')));
}

// API route to handle vehicle report form submissions
app.post('/api/report-vehicle', upload.any(), (req, res) => {
  const fullName = req.body.fullName || req.body.reporterName;
  const phone = req.body.phone || req.body.reporterPhone;
  const location = req.body.location || req.body.district || 'Unspecified Location';
  const licensePlate = req.body.licensePlate || req.body.plateNumber || 'Unknown Plate';
  const notes = req.body.notes || req.body.description || 'No additional details provided.';
  
  const imageFile = req.files && req.files[0];

  if (!fullName || !phone || !imageFile) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill in your name, phone number, and attach a photo.' 
    });
  }

  const newReport = {
    id: Date.now(),
    fullName,
    phone,
    location,
    licensePlate,
    notes,
    imagePath: `/uploads/${imageFile.filename}`,
    status: 'Pending Verification',
    created_at: new Date().toISOString()
  };

  reports.push(newReport);

  console.log('--- NEW DETAILED ROADCLEAR REPORT ---');
  console.log(`Reporter: ${newReport.fullName} (${newReport.phone})`);
  console.log(`Location: ${newReport.location}`);
  console.log(`Plate Number: ${newReport.licensePlate}`);
  console.log(`Notes: ${newReport.notes}`);
  console.log(`Saved Image File: ${imageFile.filename}`);
  console.log('------------------------------------');

  return res.json({ 
    success: true, 
    message: 'Report submitted successfully.',
    report: newReport 
  });
});

// API endpoint for retrieving all reports
app.get('/api/reports', (req, res) => {
  res.json({
    success: true,
    reports: reports
  });
});

// Serve static files directly from Vite's output 'dist' folder inside frontend/
const distPath = path.join(__dirname, 'frontend/dist');

app.use(express.static(distPath));

// Catch-all route to serve React's index.html for SPA routing
// Change this:
app.get('(.*)', (req, res) => {

// Catch-all route for SPA fallback (Express 5 compatible)
app.get('(.*)', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build files missing! Please check Render build logs.');
  }
});