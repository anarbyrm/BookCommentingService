import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { BooksController } from 'src/modules/books/books.controller';
import { AddBookRequest } from 'src/modules/books/dtos/requests/add-book.request';
import { GetAllBooksRequest } from 'src/modules/books/dtos/requests/get-list.request';
import { BookDetailResponse } from 'src/modules/books/dtos/responses/book-detail.response';
import { BookListResponse } from 'src/modules/books/dtos/responses/book-list.response';
import { Book } from 'src/modules/books/entities/book.entity';
import { IBooksService } from 'src/modules/books/services/books-service.interface';
import { AddReviewRequest } from 'src/modules/reviews/dtos/requests/add-review.request';
import { Rating } from 'src/modules/reviews/enums/rating.enum';
import { IReviewsService } from 'src/modules/reviews/services/reviews-service.interface';

describe('BooksController', function () {
    let bookService: jest.Mocked<IBooksService>;
    let reviewService: jest.Mocked<IReviewsService>;
    let bookController: BooksController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [
                {
                    provide: IBooksService,
                    useValue: {
                        getAll: jest.fn(),
                        getOne: jest.fn(),
                        add: jest.fn(),
                    },
                },
                {
                    provide: IReviewsService,
                    useValue: {
                        addBookReview: jest.fn(),
                    },
                },
            ],
        }).compile();

        bookService = moduleRef.get(IBooksService);
        reviewService = moduleRef.get(IReviewsService);
        bookController = moduleRef.get(BooksController);
    });

    describe('getAll', function () {
        it('should fetch all books', async function () {
            const books = [
                {
                    id: 1,
                    title: 'test title',
                    author: 'test author',
                    reviews: [],
                } as Book,
            ];

            const response = plainToInstance(BookListResponse, books);
            bookService.getAll.mockResolvedValue(response);

            const request = {} as GetAllBooksRequest;
            const result = await bookController.getAll(request);

            expect(result).toEqual(response);
        });
    });

    describe('getOne', function () {
        it('should fetch one book', async function () {
            const bookId = 1;
            const book = {
                id: bookId,
                title: 'test title',
                author: 'test author',
                reviews: [],
            } as Book;

            const response = plainToInstance(BookDetailResponse, book);
            bookService.getOne.mockResolvedValue(response);

            const result = await bookController.getOne(bookId);
            expect(result).toEqual(response);
        });
    });

    describe('add', function () {
        it('should add one book', async function () {
            const request = {
                title: 'test title',
                author: 'test author',
            } as AddBookRequest;

            await bookController.add(request);
            expect(jest.spyOn(bookService, 'add')).toHaveBeenCalled();
        });
    });

    describe('addBookReviews', function () {
        it('should add one book', async function () {
            const bookId = 1;
            const request = {
                comment: 'test comment',
                rating: Rating.FOUR,
            } as AddReviewRequest;

            await bookController.addBookReviews(bookId, request);

            expect(
                jest.spyOn(reviewService, 'addBookReview'),
            ).toHaveBeenCalledWith(bookId, request);
        });
    });
});
