import { AddBookRequest } from '../dtos/requests/add-book.request';
import { GetAllBooksRequest } from '../dtos/requests/get-list.request';
import { BookDetailResponse } from '../dtos/responses/book-detail.response';
import { BookListResponse } from '../dtos/responses/book-list.response';

export abstract class IBooksService {
    abstract getAll(request: GetAllBooksRequest): Promise<BookListResponse[]>;
    abstract getOne(bookId: number): Promise<BookDetailResponse>;
    abstract add(request: AddBookRequest): Promise<void>;
}
