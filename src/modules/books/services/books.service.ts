import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { IBooksService } from './books-service.interface';
import { AddBookRequest } from '../dtos/requests/add-book.response';
import { Book } from '../entities/book.entity';
import { BookListResponse } from '../dtos/responses/book-list.response';
import { BookDetailResponse } from '../dtos/responses/book-detail.response';

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
    public async getAll(): Promise<BookListResponse[]> {
        const books: Book[] = await this.booksRepository.find({
            relations: ['reviews'],
        });

        return plainToInstance(BookListResponse, books);
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

        return plainToInstance(BookDetailResponse, book);
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
