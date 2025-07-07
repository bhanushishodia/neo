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
  const apiUrl = 'https://apiv1.anantya.ai/api/Campaign/SendSingleTemplateMessage?templateId=2119';
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
      subject: `You’re in. It’s time to NEO your Automation!, ${name}!`,
text: `Hi ${name},

You just made the smartest move toward **turning WhatsApp into a full-blown growth machine** for your business. 🔥  
With **Anantya NEO**, you don’t just get access — *you get the power to choose, control, and scale the way you want.*

Here’s something extra waiting for you inside **NEO**:

1. **First 1000 utility messages — free, on us!**
2. **Lifetime validity** on your credits for all active accounts (no expiry, no waste)
3. **Free WhatsApp Widget** — make your website a sales magnet
4. **Fully customizable platform** — pick any 5 features, your way

**Pick any 5 high-impact WhatsApp tools** from chatbots to bulk campaigns, automation to insights —  
**NEO lets you handpick** your WhatsApp growth stack in **just ₹10,999/year**.

Whether you’re a solo founder or a growing brand — this is your launchpad.🎯

<a href="https://calendly.com/info-w0m/30min?month=2025-07">
  👉 Schedule a quick demo with our experts now!
</a>


Let’s get your business on WhatsApp — the right way.

Warm regards,  
— Team Anantya`

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
