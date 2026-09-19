import express from 'express';
import 'dotenv/config';
import allroutes from './Routes/Define_Routes.js'
import http from 'http'
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 3003;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' } 
});
io.on('connection', (socket) => {
  console.log('Mobile App Connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Mobile App Disconnected:', socket.id);
  });
});

app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use('',allroutes)
app.get('/', (req, res) => {
  res.send('Server is running!');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});