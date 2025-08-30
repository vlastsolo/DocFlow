import express from 'express';
import dotenv from 'dotenv';
import {invoiceRouter} from './routes/invoices';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3020;

app.use('/invoices', invoiceRouter)
app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});