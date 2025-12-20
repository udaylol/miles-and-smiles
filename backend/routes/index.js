import authRoutes from "./authRoute.js";
import userRoutes from "./userRoute.js";
import friendRoutes from "./friendRoute.js"

const Routes = {
  auth: authRoutes,
  user: userRoutes,
  friend: friendRoutes
};

export default Routes;
