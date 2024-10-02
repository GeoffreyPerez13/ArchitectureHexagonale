import { asClass, asValue, createContainer } from 'awilix';
import { InMemoryConferenceRepository } from '../../../conference/adapters/in-memory-conference-repository';
import { RandomIDGenerator } from '../../../core/adapters/random-id-generator';
import { CurrentDateGenerator } from '../../../core/adapters/current-date-generator';
import { InMemoryUserRepository } from '../../../user/adapters/in-memory-user-repository';
import { OrganizeConference } from '../../../conference/usecases/organize-conference';
import { BasicAuthenticator } from '../../../user/services/basic-authenticator';

const container = createContainer();

container.register({
    conferenceRepository: asClass(InMemoryConferenceRepository).singleton(),
    idGenerator: asClass(RandomIDGenerator).singleton(),
    dateGenerator: asClass(CurrentDateGenerator).singleton(),
    userRepository: asClass(InMemoryUserRepository).singleton()
});

const conferenceRepository = container.resolve('conferenceRepository');
const idGenerator = container.resolve('idGenerator');
const dateGenerator = container.resolve('dateGenerator');
const userRepository = container.resolve('userRepository');

container.register({
    organizeConferenceUsecase: asValue(new OrganizeConference(
        conferenceRepository, idGenerator, dateGenerator
    )),
    authenticator: asValue(new BasicAuthenticator(userRepository))
});

export default container;