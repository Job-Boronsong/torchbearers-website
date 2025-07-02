require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ email: 'admin@torchbearers.org' });
    if (existing) {
      console.log('⚠️ Admin already exists.');
      process.exit(0);
    }

    const newAdmin = new Admin({
      email: 'admin@torchbearers.org',
      password: 'admin123' // You can change this, but it's hashed automatically
    });

    await newAdmin.save();
    console.log('✅ Admin user created.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

seedAdmin();
