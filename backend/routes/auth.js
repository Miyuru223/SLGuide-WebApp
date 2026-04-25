const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const fs = require('fs');
const path = require('path');

// Admin credentials (in production, store in DB with hashed password)
let ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@slguide';
let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'slguide1234';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET || 'slguide_secret',
    { expiresIn: '24h' }
  );

  res.json({ token, username, role: 'admin' });
});

// GET /api/auth/verify
router.get('/verify', require('../middleware/auth'), (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// POST /api/auth/change-password
router.post('/change-password', require('../middleware/auth'), (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (currentPassword !== ADMIN_PASSWORD) {
    return res.status(400).json({ message: 'Incorrect current password' });
  }

  ADMIN_PASSWORD = newPassword;

  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');

      if (envContent.includes('ADMIN_PASSWORD=')) {
        envContent = envContent.replace(/ADMIN_PASSWORD=.*/g, `ADMIN_PASSWORD=${newPassword}`);
      } else {
        envContent += `\nADMIN_PASSWORD=${newPassword}\n`;
      }

      fs.writeFileSync(envPath, envContent);
    }
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error writing to .env:', err);
    res.status(500).json({ message: 'Failed to save new password' });
  }
});

module.exports = router;
