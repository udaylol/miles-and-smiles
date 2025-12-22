export const publicUserDTO = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username,
});

export const privateUserDTO = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username,
  gender: user.gender,
  birthday: user.birthday,
  friends: user.friends,
});
