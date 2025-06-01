import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

export class GetAllBooksRequest {
    @ApiPropertyOptional()
    @Max(5)
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    minRating?: number;

    @ApiPropertyOptional()
    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
