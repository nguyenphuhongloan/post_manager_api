import path from 'path';
import { DataSource } from 'typeorm';
import { config } from '../config/configENV';
const AppDataSource = new DataSource({
    type: "mysql",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [path.join(__dirname, "../modules/**/*.entity{.ts,.js}")],
    migrations: [path.join(__dirname, "/migrations/*.{ts,.js}")],
    migrationsTableName: 'migrate',
    
    // synchronize: true,
    //logging: true
});
console.log(path.join(__dirname, "/migrations"));
export default AppDataSource;
