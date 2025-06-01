import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { IReviewsService } from 'src/modules/reviews/services/reviews-service.interface';
import { ReviewsService } from 'src/modules/reviews/services/reviews.service';
import { Repository } from 'typeorm';
import { Book } from 'src/modules/books/entities/book.entity';
import { AddReviewRequest } from 'src/modules/reviews/dtos/requests/add-review.request';
import { Rating } from 'src/modules/reviews/enums/rating.enum';
import { NotFoundException } from '@nestjs/common';

describe('ReviewsService', function () {
    let service: IReviewsService;
    let reviewRepository: jest.Mocked<Repository<Review>>;
    let bookRepository: jest.Mocked<Repository<Book>>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: IReviewsService,
                    useClass: ReviewsService,
                },
                {
                    provide: getRepositoryToken(Review),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Book),
                    useValue: {
                        findOneBy: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = moduleRef.get(IReviewsService);
        reviewRepository = moduleRef.get(getRepositoryToken(Review));
        bookRepository = moduleRef.get(getRepositoryToken(Book));
    });

    describe('addBookReview', function () {
        it('should create review if book exists', async function () {
            // Arrange
            const bookId = 1;
            const mockBook = {
                id: bookId,
                title: 'test',
                author: 'test',
            } as Book;

            bookRepository.findOneBy.mockResolvedValue(mockBook);

            const addReviewRequest = {
                comment: 'test comment',
                rating: Rating.FOUR,
            } as AddReviewRequest;

            const mockReview = {
                comment: addReviewRequest.comment,
                rating: addReviewRequest.rating,
                boo: { id: mockBook.id },
            } as unknown as Review;

            reviewRepository.create.mockReturnValue(mockReview);

            // Act
            await service.addBookReview(bookId, addReviewRequest);

            // Assert
            expect(jest.spyOn(reviewRepository, 'create')).toHaveBeenCalled();
            expect(jest.spyOn(reviewRepository, 'save')).toHaveBeenCalledWith(
                mockReview,
            );
        });

        it('should throw error if book not exist', async function () {
            // Arrange
            bookRepository.findOneBy.mockResolvedValue(null);

            // Act
            const addReviewRequest = {
                comment: 'test comment',
                rating: Rating.FOUR,
            } as AddReviewRequest;

            const bookId = 1;
            const resultPromise = service.addBookReview(
                bookId,
                addReviewRequest,
            );

            // Assert
            await expect(resultPromise).rejects.toThrow(NotFoundException);
        });
    });
});
