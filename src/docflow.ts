import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import { initializeDatabase } from './AppDataSource';
import path from 'path';
import { fileURLToPath } from 'url';
import { organizationRouter } from './routes/organization';

dotenv.config();

const app: express.Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3020;

await initializeDatabase();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Добавьте эти middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/organizations', organizationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});