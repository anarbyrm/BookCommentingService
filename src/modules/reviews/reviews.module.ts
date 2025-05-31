import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsService } from './services/reviews.service';
import { IReviewsService } from './services/reviews-service.interface';
import { Book } from '../books/entities/book.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Book, Review])],
    providers: [
        {
            provide: IReviewsService,
            useClass: ReviewsService,
        },
    ],
    exports: [IReviewsService],
})
export class ReviewsModule {}
