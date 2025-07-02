const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const rateLimit = require('express-rate-limit');

// Optional: Prevent spam with rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many messages sent. Please try again later.' }
});

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
