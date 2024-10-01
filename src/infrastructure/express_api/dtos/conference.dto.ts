import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator"


export class createConferenceInputs {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsNumber()
    @IsNotEmpty()
    seats: number

    @IsDateString()
    @IsNotEmpty()
    startDate: Date

    @IsDateString()
    @IsNotEmpty()
    endDate: Date
}