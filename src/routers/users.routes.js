import { Router } from "express";

import {
  createNewUserController,
  getUsersAllController,
  getUserProfileController,
  removeUserController,
  updatedDataUserController,
} from "../controllers/users.controllers";

import verifyUserMiddleware from "../middlewares/verifyUserMiddleware.middleware";
import verifyTokenLoginMiddleware from "../middlewares/verifyTokenLoginMiddleware.middleware";
import verifyIsAdmMiddleware from "../middlewares/verifyIsAdmMiddleware.middleware";
import verifyIsAdmOrUserMiddleware from "../middlewares/verifyIsAdmOrUserMiddleware.middleware";
const userRoutes = Router();
userRoutes.post("/users", verifyUserMiddleware, createNewUserController);
userRoutes.get(
  "/users",
  verifyTokenLoginMiddleware,
  verifyIsAdmMiddleware,
  getUsersAllController
);
userRoutes.get(
  "/users/profile",
  verifyTokenLoginMiddleware,
  getUserProfileController
);
userRoutes.delete(
  "/users/:uuid",
  verifyTokenLoginMiddleware,
  removeUserController
);
userRoutes.patch(
  "/users/:uuid",
  verifyTokenLoginMiddleware,
  verifyIsAdmOrUserMiddleware,
  updatedDataUserController
);

export default userRoutes;
