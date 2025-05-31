import { AddBookRequest } from '../dtos/requests/add-book.response';
import { BookDetailResponse } from '../dtos/responses/book-detail.response';
import { BookListResponse } from '../dtos/responses/book-list.response';

export abstract class IBooksService {
    abstract getAll(): Promise<BookListResponse[]>;
    abstract getOne(bookId: number): Promise<BookDetailResponse>;
    abstract add(request: AddBookRequest): Promise<void>;
}
