import { AddReviewRequest } from '../dtos/requests/add-review.request';

export abstract class IReviewsService {
    abstract addBookReview(
        bookId: number,
        request: AddReviewRequest,
    ): Promise<void>;
}
