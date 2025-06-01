import { Book } from '../entities/book.entity';

export type RawBook = {
    raw: Array<{ books_id: number; avgRating: number }>;
    entities: Book[];
};
