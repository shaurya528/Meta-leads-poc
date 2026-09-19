import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// root
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Meta Webhook verification 
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Incoming Verification Request:');
  console.log('Mode:', mode);
  console.log('Token:', token);
  console.log('Challenge:', challenge);

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      
      return res.status(200).send(challenge);
    } else {
      console.log('Verification token mismatch.');
      return res.sendStatus(403);
    }
  }

  // 
  res.status(400).send('Missing hub query.');
});

// Meta Webhook Post function
app.post('/webhook', (req, res) => {
  res.status(200).send('EVENT_RECEIVED');
 
  const body = req.body;
  console.log(' RECEIVED WEBHOOK EVENT');
  console.log(JSON.stringify(body, null, 2));
 
  if (body.object !== 'page') return;
  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field === 'leadgen') {
       console.log("leadgen is successfully grabbed")
      }
    }
  }

 
  
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});