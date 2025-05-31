import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Rating } from '../enums/rating.enum';
import { Book } from 'src/modules/books/entities/book.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    comment: string;

    @Column()
    rating: Rating;

    @ManyToOne(() => Book, (book) => book.reviews, { onDelete: 'CASCADE' })
    book: Book;
}
