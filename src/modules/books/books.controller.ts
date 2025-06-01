import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import { IBooksService } from './services/books-service.interface';
import { AddBookRequest } from './dtos/requests/add-book.request';
import { IReviewsService } from '../reviews/services/reviews-service.interface';
import { AddReviewRequest } from '../reviews/dtos/requests/add-review.request';
import { StatusCode } from 'src/common/enums/status-code.enum';
import { GetAllBooksRequest } from './dtos/requests/get-list.request';

@Controller('books')
export class BooksController {
    constructor(
        private readonly reviewsService: IReviewsService,
        private readonly booksService: IBooksService,
    ) {}

    @Get()
    public async getAll(@Query() request: GetAllBooksRequest) {
        return await this.booksService.getAll(request);
    }

    @Get(':bookId')
    public async getOne(@Param('bookId', ParseIntPipe) bookId: number) {
        return await this.booksService.getOne(bookId);
    }

    @Post()
    @HttpCode(StatusCode.CREATED)
    public async add(@Body() request: AddBookRequest) {
        await this.booksService.add(request);
    }

    @Post(':bookId/reviews')
    @HttpCode(StatusCode.CREATED)
    public async getBookReviews(
        @Param('bookId', ParseIntPipe) bookId: number,
        @Body() request: AddReviewRequest,
    ) {
        await this.reviewsService.addBookReview(bookId, request);
    }
}
