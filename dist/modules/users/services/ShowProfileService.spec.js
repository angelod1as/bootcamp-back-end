"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _ShowProfileService = _interopRequireDefault(require("./ShowProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let showProfile;
describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    showProfile = new _ShowProfileService.default(fakeUsersRepository);
  });
  it("should be able to show user's profile", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123'
    });
    const profile = await showProfile.execute({
      user_id: user.id
    });
    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });
  it("should be not able to show non-existing user's profile", async () => {
    await expect(showProfile.execute({
      user_id: 'non-existing-id'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});