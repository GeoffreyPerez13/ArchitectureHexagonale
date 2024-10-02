import { User } from "../../../user/entities/user.entity";
import { NextFunction, Request, Response } from "express";
import { createConferenceInputs } from "../dtos/conference.dto";
import { validatorRequest } from "../utils/validate-request";
import { AwilixContainer } from "awilix";


export const organizeConference = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
    
            const body = req.body
    
            const {errors, input} = await validatorRequest(createConferenceInputs, body)
    
            if(errors) {
                return res.jsonError(errors, 400)
            }
            
            const result = await container.resolve('organizeConferenceUsecase').execute({
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
}