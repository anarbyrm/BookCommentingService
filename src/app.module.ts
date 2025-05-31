import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './modules/books/books.module';
import { BooksController } from './modules/books/books.controller';
import { ReviewsModule } from './modules/reviews/reviews.module';
import datasource from './database/datasource';

@Module({
    imports: [
        TypeOrmModule.forRoot(datasource.options),
        ReviewsModule,
        BooksModule,
    ],
    controllers: [BooksController],
    exports: [],
})
export class AppModule {}
