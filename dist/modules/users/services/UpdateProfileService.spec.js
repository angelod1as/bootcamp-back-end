"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _UpdateProfileService = _interopRequireDefault(require("./UpdateProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let updateProfile;
describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    updateProfile = new _UpdateProfileService.default(fakeUsersRepository, fakeHashProvider);
  });
  it("should be able to update user's profile", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com'
    });
    expect(updatedUser.name).toBe('Jane Doe');
    expect(updatedUser.email).toBe('janedoe@example.com');
  });
  it("should be not able to update non-existing user's profile", async () => {
    await expect(updateProfile.execute({
      user_id: 'non-existing-id',
      name: 'Test',
      email: 'test@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it("should not be able to change user's email to an existing one", async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'existing-email@example.com',
      password: '123456'
    });
    const user = await fakeUsersRepository.create({
      name: 'New User',
      email: 'new-email@example.com',
      password: '123456'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'New User',
      email: 'existing-email@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it("should be able to update user's password", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      old_password: '123456',
      password: '123123'
    });
    expect(updatedUser.password).toBe('123123');
  });
  it("should not be able to update user's password w/o old password", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it("should not be able to update user's password with wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      old_password: 'wrong-old-password',
      password: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});