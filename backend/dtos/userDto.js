export const publicUserDTO = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username,
});

// export const privateUserDTO = () => {
// 
// }