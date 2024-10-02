import { addDays, addHours } from "date-fns"
import { User } from "../../user/entities/user.entity"
import { Conference } from "../entities/conference.entity"
import { ChangeSeats } from "./change-seats"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"

describe("Feature: Changing the number of seats", () => {
    async function expectSeatsUnchange() {
        const fetchedConference = await repository.findById(conference.props.id)
        expect(fetchedConference?.props.seats).toEqual(50)
    }

    const johnDoe = new User({
        id: 'john-doe',
        emailAddress: 'johndoe@gmail.com',
        password: 'qwerty'
    })

    const bob = new User({
        id: 'bob',
        emailAddress: 'bob@gmail.com',
        password: 'qwerty'
    })

    const conference = new Conference({
        id: 'id-1',
        organizerId: johnDoe.props.id,
        title: "My first conference",
        seats: 50,
        startDate: addDays(new Date(), 4),
        endDate: addDays(addHours(new Date(), 2), 4)
    })

    let repository: InMemoryConferenceRepository
    let useCase: ChangeSeats

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository()
        await repository.create(conference)
        useCase = new ChangeSeats(repository)
    })

    describe("Scenario: Happy path", () => {
        it('should change the number of seats', async () => {
            await useCase.execute({
                user: johnDoe,
                conferenceId: conference.props.id,
                seats: 100
            })

            const fetchedConference = await repository.findById(conference.props.id)
            expect(fetchedConference?.props.seats).toEqual(100) // Vérifie que les sièges ont bien changé
        })
    })

    describe('Scenario: Conference does not exist', () => {
        it('should fail', async () => {
            await expect(useCase.execute({
                user: johnDoe,
                conferenceId: 'non-existing-id',
                seats: 100
            })).rejects.toThrow('Conference not found')
        })
    })

    describe('Scenario: Update the conference of someone else', () => {
        it('should fail', async () => {
            await expect(useCase.execute({
                user: bob, // Utilisation de bob au lieu de johnDoe
                conferenceId: conference.props.id,
                seats: 100
            })).rejects.toThrow('You are not allowed to update this conference')

            await expectSeatsUnchange()
        }) 
    })

    describe('Scenario: Number of seats <= 1000', () => {
        it('should fail', async () => {
            await expect(useCase.execute({
                user: johnDoe,
                conferenceId: conference.props.id,
                seats: 10001
            })).rejects.toThrow('The conference must have a maximum of 1000 seats and a minimum of 20 seats')

            await expectSeatsUnchange()
        })
    })

    describe('Scenario: Number of seats >= 20', () => {
        it('should fail', async () => {
            await expect(useCase.execute({
                user: johnDoe,
                conferenceId: conference.props.id,
                seats: 15
            })).rejects.toThrow('The conference must have a maximum of 1000 seats and a minimum of 20 seats')

            await expectSeatsUnchange()
        })
    })
})