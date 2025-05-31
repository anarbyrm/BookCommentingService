import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './services/books.service';
import { IBooksService } from './services/books-service.interface';
import { Book } from './entities/book.entity';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
    imports: [TypeOrmModule.forFeature([Book]), ReviewsModule],
    controllers: [BooksController],
    providers: [
        {
            provide: IBooksService,
            useClass: BooksService,
        },
    ],
    exports: [IBooksService],
})
export class BooksModule {}
