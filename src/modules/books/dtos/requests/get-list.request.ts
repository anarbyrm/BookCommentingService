import { Type } from 'class-transformer';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

export class GetAllBooksRequest {
    @Max(5)
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    minRating?: number;

    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
