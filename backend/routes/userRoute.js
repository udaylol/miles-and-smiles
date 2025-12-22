import express from 'express';
import UserController from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { validate } from '../middlewares/validate.js';
import { updateUserSchema } from '../validators/userSchema.js';
import { updateCredentialsSchema } from '../validators/credentialsSchema.js';

const router = express.Router();

router.get('/me', auth, UserController.getMe);

router.post('/favourite/:gameId', auth, UserController.addToFavourites);

router.delete('/favourite/:gameId', auth, UserController.removeFromFavourites);

router.get('/:id', auth, UserController.getUserById);

router.patch(
  '/me',
  auth,
  validate(updateUserSchema),
  UserController.updateUser
);

router.patch(
  '/me/credentials',
  auth,
  validate(updateCredentialsSchema),
  UserController.updateCredentials
);

router.patch(
  '/me/profile-picture',
  auth,
  upload.single('pfp'),
  UserController.updateProfilePicture
);

router.delete('/me/profile-picture', auth, UserController.deleteProfilePicture);

export default router;
