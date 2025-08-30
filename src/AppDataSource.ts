
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "docflowdb.sql",
  synchronize: true,
  logging: true,
  entities: ["models/**/*.ts"],
  "migrations": ["migrations/**/*.ts"],
  "subscribers": ["src/subscribers/**/*.ts"]
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization', err);
    process.exit(1);
  }
}

export default AppDataSource;