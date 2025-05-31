import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
});
