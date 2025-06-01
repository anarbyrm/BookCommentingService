import { Expose, Exclude, Type } from 'class-transformer';
import { ReviewListResponse } from 'src/modules/reviews/dtos/responses/review-list.response';

@Exclude()
export class BookListResponse {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    author: string;

    @Expose()
    avgRating: number;

    @Expose()
    @Type(() => ReviewListResponse)
    reviews: ReviewListResponse[];
}
