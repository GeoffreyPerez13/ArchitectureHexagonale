import { addDays, addHours } from 'date-fns';
import app from '../infrastructure/express_api/app';
import request from 'supertest';
import { User } from '../user/entities/user.entity';
import container from '../infrastructure/express_api/config/dependency-injection';

describe('Feature: Organize Conference', () => {
    const johnDoe = new User({
        id: 'john-doe',
        emailAddress: 'johndoe@gmail.com',
        password: 'qwerty'
    });

    let repository: any;

    beforeEach(async () => {
        repository = container.resolve('userRepository');
        await repository.create(johnDoe);
    });

    it('should organize a conference', async () => {
        const token = Buffer.from(`${johnDoe.props.emailAddress}:${johnDoe.props.password}`).toString('base64');

        const result = await request(app)
            .post('/conference')
            .set('Authorization', `Basic ${token}`)
            .send({
                title: 'My first conference',
                seats: 100,
                startDate: addDays(new Date(), 4).toISOString(),
                endDate: addDays(addHours(new Date(), 2), 4).toISOString()
            });

        expect(result.status).toBe(201);
        expect(result.body.data).toEqual({ id: expect.any(String) });
    });
});