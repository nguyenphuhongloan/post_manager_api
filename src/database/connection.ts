import { DataSource } from 'typeorm';
import { config } from '../config/configENV';
const AppDataSource = new DataSource({
    type: "mysql",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: ["src/modules/**/*.entity{.ts,.js}"],
    migrations: ["src/migration/*.ts"],
    synchronize: true,
    //logging: true,
});

export default AppDataSource;


