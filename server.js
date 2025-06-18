import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import FormData from 'form-data';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Backend Server is Running!');
});

// ✅ WhatsApp Template Send
app.post('/api/send-whatsapp-message', async (req, res) => {
  const { phoneNumber, name } = req.body;
  console.log('📩 Received request payload:', req.body);

  if (!phoneNumber || !name) {
    return res.status(400).json({ success: false, error: 'Missing phoneNumber or name' });
  }

  // 👉 Prefix +91 if not present
  const formattedNumber = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;

  const apiUrl = 'https://apiv1.anantya.ai/api/Campaign/SendSingleTemplateMessage?templateId=2087';
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
    console.error('❌ Error sending message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
