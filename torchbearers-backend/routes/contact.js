const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

// Rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many messages sent. Please try again later.' }
});

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Save to DB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your_email@example.com
        pass: process.env.EMAIL_PASS  // your_email_password or app password
      }
    });

    const mailOptions = {
      from: `"Torchbearers Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      html: `<h3>New Message from ${name}</h3>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent and emailed successfully.' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
