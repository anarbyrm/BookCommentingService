import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import { IBooksService } from './services/books-service.interface';
import { AddBookRequest } from './dtos/requests/add-book.request';
import { IReviewsService } from '../reviews/services/reviews-service.interface';
import { AddReviewRequest } from '../reviews/dtos/requests/add-review.request';
import { GetAllBooksRequest } from './dtos/requests/get-list.request';
import {
    ApiBody,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { BookListResponse } from './dtos/responses/book-list.response';
import { BookDetailResponse } from './dtos/responses/book-detail.response';

@ApiTags('Books')
@Controller('books')
export class BooksController {
    constructor(
        private readonly reviewsService: IReviewsService,
        private readonly booksService: IBooksService,
    ) {}

    @ApiResponse({ type: BookListResponse, isArray: true })
    @Get()
    public async getAll(@Query() request: GetAllBooksRequest) {
        return await this.booksService.getAll(request);
    }

    @ApiParam({ type: Number, name: 'bookId' })
    @ApiResponse({ type: BookDetailResponse })
    @Get(':bookId')
    public async getOne(@Param('bookId', ParseIntPipe) bookId: number) {
        return await this.booksService.getOne(bookId);
    }

    @ApiResponse({ status: HttpStatus.CREATED })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async add(@Body() request: AddBookRequest) {
        await this.booksService.add(request);
    }

    @ApiBody({ type: AddReviewRequest })
    @ApiResponse({ status: HttpStatus.CREATED })
    @Post(':bookId/reviews')
    @HttpCode(HttpStatus.CREATED)
    public async addBookReviews(
        @Param('bookId', ParseIntPipe) bookId: number,
        @Body() request: AddReviewRequest,
    ) {
        await this.reviewsService.addBookReview(bookId, request);
    }
}
