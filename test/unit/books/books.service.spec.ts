import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddBookRequest } from 'src/modules/books/dtos/requests/add-book.request';
import { GetAllBooksRequest } from 'src/modules/books/dtos/requests/get-list.request';
import { BookDetailResponse } from 'src/modules/books/dtos/responses/book-detail.response';
import { BookListResponse } from 'src/modules/books/dtos/responses/book-list.response';
import { Book } from 'src/modules/books/entities/book.entity';
import { IBooksService } from 'src/modules/books/services/books-service.interface';
import { BooksService } from 'src/modules/books/services/books.service';
import { Repository, SelectQueryBuilder } from 'typeorm';

describe('BookService', function () {
    let bookService: BooksService;
    let bookRepository: jest.Mocked<Repository<Book>>;
    let mockQueryBuilder: Partial<SelectQueryBuilder<Book>>;

    beforeEach(async () => {
        mockQueryBuilder = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getRawAndEntities: jest.fn().mockResolvedValue({
                raw: [{ books_id: 1, avgRating: 4.5 }],
                entities: [
                    {
                        id: 1,
                        title: 'mocked book',
                        author: 'mock author',
                        reviews: [],
                    },
                ],
            }),
        };

        const mockBookRepository = {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: IBooksService,
                    useClass: BooksService,
                },
                {
                    provide: getRepositoryToken(Book),
                    useValue: mockBookRepository,
                },
            ],
        }).compile();

        bookService = moduleRef.get(IBooksService);
        bookRepository = moduleRef.get(getRepositoryToken(Book));
    });

    describe('getAll', function () {
        it('should return all books based on request', async function () {
            const getAllRequest = {
                minRating: 3,
                sortOrder: 'ASC',
            } as GetAllBooksRequest;

            const result = await bookService.getAll(getAllRequest);

            expect(mockQueryBuilder.getRawAndEntities).toHaveBeenCalled();
            expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
                'avgRating',
                'ASC',
            );

            const response = {
                id: 1,
                title: 'mocked book',
                author: 'mock author',
                avgRating: 4.5,
                reviews: [],
            } as unknown as BookListResponse;

            expect(result).toEqual([response]);
        });
    });

    describe('getOne', function () {
        it('should get one record for book if exists', async function () {
            const bookId = 1;
            const mockBook = {
                id: bookId,
                author: 'test',
                title: 'test',
                reviews: [],
            } as Book;

            bookRepository.findOne.mockResolvedValue(mockBook);
            const book = await bookService.getOne(bookId);

            expect(book).toBeInstanceOf(BookDetailResponse);
            expect(book.author).toEqual(mockBook.author);
            expect(book.title).toEqual(mockBook.title);
            expect(book.avgRating).toEqual(0);
        });

        it('should throw exception if book not exist', async function () {
            const bookId = 1;
            bookRepository.findOne.mockResolvedValue(null);

            const resultPromise = bookService.getOne(bookId);
            expect(jest.spyOn(bookRepository, 'findOne')).toHaveBeenCalledWith({
                where: { id: bookId },
                relations: ['reviews'],
            });
            await expect(resultPromise).rejects.toThrow(NotFoundException);
        });
    });

    describe('add', function () {
        it('should add a new book record', async function () {
            const addBookRequest = {
                author: 'test',
                title: 'test',
            } as AddBookRequest;

            const newBook = {
                author: addBookRequest.author,
                title: addBookRequest.title,
            } as Book;

            bookRepository.create.mockReturnValue(newBook);

            await bookService.add(addBookRequest);

            expect(jest.spyOn(bookRepository, 'create')).toHaveBeenCalled();
            expect(jest.spyOn(bookRepository, 'save')).toHaveBeenCalledWith(
                newBook,
            );
        });
    });
});
