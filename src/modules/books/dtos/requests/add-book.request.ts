import { IsNotEmpty, IsString } from 'class-validator';

export class AddBookRequest {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;
}
