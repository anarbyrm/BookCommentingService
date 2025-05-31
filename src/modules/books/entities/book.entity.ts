import { Review } from 'src/modules/reviews/entities/review.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    title: string;

    @Column()
    author: string;

    @OneToMany(() => Review, (review) => review.book, { cascade: true })
    reviews: Review[];
}
