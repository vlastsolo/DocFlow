
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

export default AppDataSource;