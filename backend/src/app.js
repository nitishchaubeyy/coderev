const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');

const app = express();

// ✅ Allow only frontend URLs
app.use(cors({
  origin: ['http://localhost:5173', 'https://coderevv.netlify.app']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/ai', aiRoutes);

module.exports = app;
