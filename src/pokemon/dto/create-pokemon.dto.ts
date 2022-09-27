import { IsNumber, IsPositive, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'

export class CreatePokemonDto {

    @IsString()
    @MinLength(1)
    @MaxLength(30)
    readonly name: string;

    @IsNumber()
    @IsPositive()
    @Min(1)
    readonly no: number;
}
