import { getData } from './services/notion.js';
import functions from 'firebase-functions';
import express from 'express';
// import cors from 'cors';
import helmet from 'helmet';

const PORT = 3000;
let app = express();
// app.use(cors());
app.use(helmet());
// app.use(express.static('public')); // csp error
// get > http://localhost:5000/histories
app.get('/histories', async (req, res) => {
  const data = await getData();
  res.json(data);
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export const expressapi = functions.https.onRequest(app);
