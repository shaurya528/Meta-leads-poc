import express from 'express';
import 'dotenv/config';
import allroutes from './Routes/Define_Routes.js'

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// root
app.use('',allroutes)
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});