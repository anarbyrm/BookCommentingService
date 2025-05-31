import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { IBooksService } from './services/books-service.interface';
import { AddBookRequest } from './dtos/requests/add-book.response';
import { IReviewsService } from '../reviews/services/reviews-service.interface';
import { AddReviewRequest } from '../reviews/dtos/requests/add-review.request';

@Controller('books')
export class BooksController {
    constructor(
        private readonly reviewsService: IReviewsService,
        private readonly booksService: IBooksService,
    ) {}

    @Get()
    public async getAll() {
        return await this.booksService.getAll();
    }

    @Get(':bookId')
    public async getOne(@Param('bookId') bookId: number) {
        return await this.booksService.getOne(bookId);
    }

    @Post()
    @HttpCode(201)
    public async add(@Body() request: AddBookRequest) {
        await this.booksService.add(request);
    }

    @Post(':bookId/reviews')
    @HttpCode(201)
    public async getBookReviews(
        @Param('bookId') bookId: number,
        @Body() request: AddReviewRequest,
    ) {
        await this.reviewsService.addBookReview(bookId, request);
    }
}
