import { getData } from './services/notion.js';
import express from 'express';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static('public'));
// get > http://localhost:5000/histories
app.get('/histories', async (req, res) => {
  const data = await getData();
  res.json(data);
});
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
