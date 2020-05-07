import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createAppointment = new CreateUserService(fakeUsersRepository);

    const user = await createAppointment.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const createAppointment = new CreateUserService(fakeUsersRepository);

    await createAppointment.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123',
    });

    expect(
      createAppointment.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
