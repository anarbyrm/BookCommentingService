import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { App } from 'supertest/types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from 'src/modules/books/entities/book.entity';
import { Repository } from 'typeorm';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { plainToInstance } from 'class-transformer';
import { BookDetailResponse } from 'src/modules/books/dtos/responses/book-detail.response';
import { BookListResponse } from 'src/modules/books/dtos/responses/book-list.response';
import datasource from 'src/database/datasource';
import { Rating } from 'src/modules/reviews/enums/rating.enum';
import { deepStrictEqual } from 'assert';

describe('BooksController', function () {
    let application: INestApplication;
    let bookRepository: Repository<Book>;
    let reviewRepository: Repository<Review>;
    let book: Book;

    beforeEach(async () => {
        await datasource.initialize();
        await datasource.runMigrations();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        application = moduleFixture.createNestApplication();
        await application.init();

        bookRepository = application.get<Repository<Book>>(
            getRepositoryToken(Book),
        );

        reviewRepository = application.get<Repository<Review>>(
            getRepositoryToken(Review),
        );

        book = bookRepository.create({
            title: `test title ${Date.now()}`,
            author: 'test author',
        });

        book = await bookRepository.save(book);
    });

    it('GET /api/books', async () => {
        const response = plainToInstance(BookListResponse, book);
        response.avgRating = 0;
        response.reviews = [];

        return request(application.getHttpServer())
            .get('/books')
            .expect(200)
            .expect((res) => {
                deepStrictEqual(res.body, [response]);
            });
    });

    it('POST /api/books', async () => {
        await request(application.getHttpServer())
            .post('/books')
            .send({
                title: 'test',
                author: 'test',
            })
            .expect(201);

        const bookCount = await bookRepository.count();
        expect(bookCount).toEqual(2);
    });

    it('GET /api/books/:bookId', async () => {
        const response = plainToInstance(BookDetailResponse, book);
        response.avgRating = 0;
        response.reviews = [];

        return request(application.getHttpServer())
            .get(`/books/${book.id}`)
            .expect(200)
            .expect((res) => {
                deepStrictEqual(res.body, response);
            });
    });

    it('POST /api/books/:bookId/reviews', async () => {
        await request(application.getHttpServer())
            .post(`/books/${book.id}/reviews`)
            .send({
                comment: 'test comment',
                rating: Rating.ONE,
            })
            .expect(201);

        const reviewCount = await reviewRepository.count();
        expect(reviewCount).toEqual(1);
    });

    afterEach(async () => {
        await reviewRepository.clear();
        await bookRepository.clear();
        await datasource.destroy();
        await application.close();
    });
});
