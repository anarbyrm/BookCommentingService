import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReviewListResponse {
    @Expose()
    rating: number;

    @Expose()
    comment: string;
}
