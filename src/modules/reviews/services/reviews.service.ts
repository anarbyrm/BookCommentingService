import { InjectRepository } from '@nestjs/typeorm';
import { IReviewsService } from './reviews-service.interface';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { AddReviewRequest } from '../dtos/requests/add-review.request';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from 'src/modules/books/entities/book.entity';

@Injectable()
export class ReviewsService implements IReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {}

    /**
     * Creates a review for a specified book with given body params.
     *
     * @param {number} bookId
     * @param {AddReviewRequest} request
     */
    public async addBookReview(
        bookId: number,
        request: AddReviewRequest,
    ): Promise<void> {
        const book: Book | null = await this.bookRepository.findOneBy({
            id: bookId,
        });

        if (!book) {
            throw new NotFoundException(`Book with id=${bookId} not found.`);
        }

        const review: Review = this.reviewsRepository.create({
            book: book,
            comment: request.comment,
            rating: request.rating,
        });

        await this.reviewsRepository.save(review);
    }
}
