import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Rating } from '../../enums/rating.enum';

export class AddReviewRequest {
    @IsString()
    comment: string;

    @IsNotEmpty()
    @IsEnum(Rating)
    rating: Rating;
}
