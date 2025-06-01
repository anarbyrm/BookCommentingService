import { DataSource } from 'typeorm';

const isTest = process.env.NODE_ENV === 'test';

export default new DataSource({
    type: 'sqlite',
    database: isTest ? 'test-db.sqlite' : 'db.sqlite',
    entities: [isTest ? 'src/**/*.entity.ts' : 'dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
});
