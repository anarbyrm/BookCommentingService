import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IBooksService } from './books-service.interface';
import { AddBookRequest } from '../dtos/requests/add-book.request';
import { Book } from '../entities/book.entity';
import { BookListResponse } from '../dtos/responses/book-list.response';
import { BookDetailResponse } from '../dtos/responses/book-detail.response';
import { GetAllBooksRequest } from '../dtos/requests/get-list.request';
import { RawBook } from '../types/raw-book-data.type';

@Injectable()
export class BooksService implements IBooksService {
    constructor(
        @InjectRepository(Book)
        private readonly booksRepository: Repository<Book>,
    ) {}

    /**
     * Fetches all books with related reviews.
     *
     * @returns {Promise<BookListResponse[]>}
     */
    public async getAll(
        @Query() request: GetAllBooksRequest,
    ): Promise<BookListResponse[]> {
        const query = this.buildQuery(request);
        const { raw, entities }: RawBook = await query.getRawAndEntities();

        const result: BookListResponse[] = [];
        for (const entity of entities) {
            const instance = plainToInstance(BookListResponse, entity);
            const rawBook = raw.find((r) => r.books_id === entity.id);
            instance.avgRating = rawBook?.avgRating ?? 0;
            result.push(instance);
        }

        return result;
    }

    /**
     * Builds book query using filter and sort params.
     *
     * @param {GetAllBooksRequest} request
     * @returns {SelectQueryBuilder}
     */
    private buildQuery(request: GetAllBooksRequest): SelectQueryBuilder<Book> {
        const query = this.booksRepository
            .createQueryBuilder('books')
            .leftJoinAndSelect('books.reviews', 'review')
            .addSelect((subQuery) => {
                return subQuery
                    .select('AVG(r.rating)', 'avg')
                    .from('review', 'r')
                    .where('r.bookId = books.id');
            }, 'avgRating');

        if (request.minRating) {
            query.where('avgRating >= :minRating', {
                minRating: request.minRating,
            });
        }

        query.orderBy('avgRating', request.sortOrder);
        return query;
    }

    /**
     * Fetches one book with specified id. If not exist throw error.
     *
     * @param {number} bookId
     * @returns {Promise<BookDetailResponse>}
     */
    public async getOne(bookId: number): Promise<BookDetailResponse> {
        const book: Book | null = await this.booksRepository.findOne({
            where: { id: bookId },
            relations: ['reviews'],
        });

        if (!book) {
            throw new NotFoundException(`Book with id=${bookId} not found.`);
        }

        const response = plainToInstance(BookDetailResponse, book);
        const sum = book.reviews.reduce((sum, value) => sum + value.rating, 0);
        const avgRating = sum / book.reviews.length;
        response.avgRating = avgRating;
        return response;
    }

    /**
     * Creates a book record with specified body params.
     *
     * @param {AddBookRequest} request
     * @returns {Promise<void>}
     */
    public async add(request: AddBookRequest): Promise<void> {
        const book: Book = this.booksRepository.create(request);
        await this.booksRepository.save(book);
    }
}
