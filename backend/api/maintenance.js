const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const nodemailer = require('nodemailer');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  const { name, email, machineId, issue } = req.body;

  try {
    const newRequest = new Request({ name, email, machineId, issue });
    await newRequest.save();

    await transporter.sendMail({
      from: `"MaintainEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Maintenance Request Received",
      text: `Hi ${name},\n\nWe have received your maintenance request for Machine ID: ${machineId}. Our team will contact you shortly.\n\nThank you!\nMaintainEase Team`,
    });

    res.status(200).json({ message: 'Request submitted and email sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting request' });
  }
});

module.exports = router;
