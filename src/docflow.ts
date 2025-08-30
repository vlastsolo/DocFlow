import express from 'express';
import dotenv from 'dotenv';
import {invoiceRouter} from './routes/invoices';
import { engine } from 'express-handlebars';
import AppDataSource from './AppDataSource';
import { initializeDatabase } from './AppDataSource';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app: express.Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3020;

await initializeDatabase();

app.engine('handlebars', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/invoices', invoiceRouter)

app.get('/home', (req, res) => {
  res.render('home', {
    title: 'О нас',
    content: 'Добро пожаловать на страницу о нашей компании! Мы работаем на рынке более 10 лет и специализируемся на создании инновационных решений.',
    companyInfo: {
      year: 2013,
      employees: 50,
}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});