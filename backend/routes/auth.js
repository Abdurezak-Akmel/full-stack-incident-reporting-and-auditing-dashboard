const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const errorHandler = require('../middleware/errorHandler');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});


// 1. Send Admin Registration Code (Admin Only)
router.post('/send-admin-code', verifyToken, isAdmin, async (req, res) => {
  const { email } = req.body;
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  try {
    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (existingUser.rows.length > 0) {
      // Update existing user with registration code
      const result = await pool.query("UPDATE users SET registration_code = $1 WHERE email = $2", [code, email]);
    } else {
      // Insert new user with registration code (admin will complete registration later)
      const tempPassword = await bcrypt.hash('temp-password-' + Date.now(), 10);
      const result = await pool.query(
        "INSERT INTO users (email, full_name, password, registration_code, role, is_verified) VALUES ($1, $2, $3, $4, 'admin', false) RETURNING id",
        [email, 'Pending Registration', tempPassword, code]
      );
      console.log('Inserted new user:', result.rows[0]);
    }

    // Send email with registration code
    await transporter.sendMail({
      to: email,
      subject: "Admin Registration Code",
      text: `Your Admin Invite Code is: ${code}. Use this to create your Admin account.`
    });
    
    console.log('Email sent successfully to:', email);
    res.json({ message: "Admin code sent!" });
    
  } catch (error) {
    console.error('Error in send-admin-code:', error);
    res.status(500).json({ message: "Failed to send admin code", error: error.message });
  }
});

// 2. Register (Handles both User and Admin)
router.post('/register', async (req, res) => {
    const { name, email, password, role, adminCode } = req.body;
    
    if (role === 'admin') {
        // Verify admin code (except for the very first admin you manually inserted)
        const checkCode = await pool.query("SELECT * FROM users WHERE email = $1 AND registration_code = $2", [email, adminCode]);
        if (checkCode.rows.length === 0) return res.status(400).json({message: "Invalid or missing Admin Registration Code"});
    }

    const hashedPw = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // Check if user already exists (for admin invites)
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (existingUser.rows.length > 0) {
            // Update existing user (admin invite case)
            await pool.query(
                "UPDATE users SET full_name = $1, password = $2, otp_code = $3, is_verified = false WHERE email = $4",
                [name, hashedPw, otp, email]
            );
        } else {
            // Insert new user (regular registration)
            await pool.query(
                "INSERT INTO users (full_name, email, password, role, otp_code) VALUES ($1, $2, $3, $4, $5)",
                [name, email, hashedPw, role, otp]
            );
        }
        
        await transporter.sendMail({
            to: email,
            subject: "Verify your account",
            text: `Your account verification OTP is: ${otp}`
        });
        res.json({ message: "OTP Sent to email" });
    } catch (err) { 
        console.error('Registration error:', err);
        res.status(500).json({ message: "Registration failed", error: err.message }); 
    }
});

// 3. Verify OTP
router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1 AND otp_code = $2", [email, otp]);
    
    if (user.rows.length === 0) return res.status(400).json({message: "Invalid OTP"});
    
    await pool.query("UPDATE users SET is_verified = true, otp_code = NULL WHERE email = $1", [email]);
    res.json({ message: "Verified successfully!" });
});

// 4. Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (user.rows.length === 0) return res.status(400).json({message: "User not found"});
    if (!user.rows[0].is_verified) return res.status(400).json({message: "Please verify your email first"});

    const validPw = await bcrypt.compare(password, user.rows[0].password);
    if (!validPw) return res.status(400).json({message: "Wrong password"});

    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
        token, 
        role: user.rows[0].role, 
        name: user.rows[0].full_name, 
        email: user.rows[0].email 
    });
});

// 5. Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const recoveryCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const result = await pool.query("UPDATE users SET otp_code = $1 WHERE email = $2 RETURNING id", [recoveryCode, email]);
    
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    await transporter.sendMail({
        to: email,
        subject: "Password Recovery Code",
        text: `Your password reset code is: ${recoveryCode}`
    });
    res.json({ message: "Recovery code sent!" });
});

// 6. Reset Password
router.post('/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1 AND otp_code = $2", [email, code]);
    
    if (user.rows.length === 0) return res.status(400).json({ message: "Invalid code" });

    const hashedPw = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1, otp_code = NULL WHERE email = $2", [hashedPw, email]);
    res.json({ message: "Password updated successfully" });
});

router.use(errorHandler);

module.exports = router;