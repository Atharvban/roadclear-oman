const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Enable CORS for React frontend
app.use(cors());

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
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API route to handle vehicle report form submissions with extra fields
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

app.listen(PORT, () => {
  console.log(`RoadClear server running at http://localhost:${PORT}`);
});