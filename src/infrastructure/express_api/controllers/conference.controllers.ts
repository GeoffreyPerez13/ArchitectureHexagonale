import { CurrentDateGenerator } from "../../../core/adapters/current-date-generator";
import { RandomIDGenerator } from "../../../core/adapters/random-id-generator";
import { OrganizeConference } from "../../../conference/usecases/organize-conference";
import { User } from "../../../user/entities/user.entity";
import { NextFunction, Request, Response } from "express";
import { createConferenceInputs } from "../dtos/conference.dto";
import { validatorRequest } from "../utils/validate-request";
import { InMemoryConferenceRepository } from "../../../conference/adapters/in-memory-conference-repository";


const idGenerator = new RandomIDGenerator()
const currentDateGenerator = new CurrentDateGenerator()
const repository = new InMemoryConferenceRepository()
const usecase = new OrganizeConference(
    repository, idGenerator, currentDateGenerator
)

export const organizeConference = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const body = req.body

        const {errors, input} = await validatorRequest(createConferenceInputs, body)

        if(errors) {
            return res.jsonError(errors, 400)
        }
        
        const result = await usecase.execute({
            user: req.user as User,
            title: input.title,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            seats: input.seats
        })

        return res.jsonSuccess({id: result.id}, 201)
    } catch (error) {
        next(error);
    }
};