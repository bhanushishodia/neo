import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import nodemailer from 'nodemailer'; // 👈 Added this

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Backend Server is Running!');
});

// ✅ Send WhatsApp Message
app.post('/api/send-whatsapp-message', async (req, res) => {
  const { phoneNumber, name } = req.body;
  console.log('📩 WhatsApp payload:', req.body);

  if (!phoneNumber || !name) {
    return res.status(400).json({ success: false, error: 'Missing phoneNumber or name' });
  }

  const formattedNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
  const apiUrl = 'https://apiv1.anantya.ai/api/Campaign/SendSingleTemplateMessage?templateId=2117';
  const apiKey = '931C2D6E-0C0D-4A6F-880B-B1FE075F5956';

  const formData = new FormData();
  formData.append('ContactName', name);
  formData.append('ContactNo', formattedNumber);
  formData.append('Attribute1', name);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'accept': '*/*',
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const data = await response.json();
    return res.status(200).json({ success: true, data });

  } catch (err) {
    console.error('❌ Error sending WhatsApp message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Send Email (Nodemailer)
app.post('/api/send-email', async (req, res) => {
  const { name, email } = req.body;
  console.log('📧 Email payload:', req.body);

  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Missing name or email' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'info@anantya.ai',
        pass: 'ycwnkxqnzsmcuqoj', // 👈 Use your Gmail App Password here
 
      },
    });

    await transporter.sendMail({
      from: 'info@anantya.ai',
      to: email,
      cc: ['yashika@anantya.ai', 'sales@anantya.ai', 'mokshika@anantya.ai'],
      subject: `Let’s Make Your Business Future-Ready with AI – Here’s How, ${name}!`,
      text: `Hi ${name},

Hope this note finds you thriving!

I’m reaching out from Anantya.ai, where we’re redefining how businesses connect, convert, and scale using AI-driven communication. From automating conversations to building seamless customer journeys, we help brands do more—faster and smarter.

If you're exploring ways to reduce response time, personalize engagement at scale, or simply make your operations more efficient (and who isn't?), Anantya can help. Think of us as your one-stop platform for omnichannel communication, intelligent automation, and CRM—all powered by AI.

I’d love to schedule a quick 15-minute call to walk you through how Anantya can drive tangible results for your team. What does your calendar look like this week?

Looking forward to connecting!

Warm regards,  
Anantya Team`,
    });

    console.log('✅ Email sent to:', email);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ Email send failed:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
