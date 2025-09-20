import { DataSource } from "typeorm";
//import { economicActivity } from "./models/economicActivity";
import { Organization } from "./models/organization";
import { ProductService } from "./models/productService";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "docflowdb.sql",
  synchronize: true,
  logging: true,
    entities: [
    Organization,
    ProductService,
    //economicActivity
  ],
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