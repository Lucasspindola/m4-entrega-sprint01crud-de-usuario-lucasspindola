import express, { response } from "express";
import { v4 as uuidV4 } from "uuid";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "./database.js";

const app = express();
app.use(express.json());

// Middleware

const verifyTokenLoginMiddleware = (request, response, next) => {
  const token = request.headers.authorization;

  if (!token) {
    return response
      .status(401)
      .json({ message: "Missing authorization headers" });
  }

  const tokenValidate = token.split(" ")[1];
  jwt.verify(tokenValidate, "SECRET_KEY", (error, decoded) => {
    if (error) {
      return response
        .status(401)
        .json({ message: "Missing authorization headers" });
    }
    request.user = {
      uuid: decoded.sub,
      email: decoded.email,
      isAdm: decoded.isAdm,
    };
  });
  next();
};
const verifyIsAdmMiddleware = (request, response, next) => {
  const isAdm = request.user.isAdm;
  if (!isAdm) {
    return response.status(403).json({ message: "missing admin permissions" });
  }
  next();
};

const verifyIsAdmOrUserMiddleware = (request, response, next) => {
  const isAdm = request.user.isAdm;
  const idIsUser = request.user.uuid;
  const { uuid } = request.params;

  if (!isAdm) {
    if (idIsUser !== uuid) {
      return response.status(403).json({
        message: "missing admin permissions",
      });
    }
  }

  return next();
};

const verifyUserMiddleware = (request, response, next) => {
  const { email } = request.body;
  const userAlrealdyExists = users.find((user) => user.email === email);

  if (userAlrealdyExists) {
    return response.status(409).json({ message: "E-mail already registered" });
  }
  next();
};

// Services

const createNewUserService = async ({ name, email, isAdm, password }) => {
  const newUser = {
    uuid: uuidV4(),
    createdOn: new Date(),
    updatedOn: new Date(),
    name: name,
    email: email,
    isAdm: isAdm,
    password: await hash(password, 10),
  };

  users.push(newUser);
  const user = { ...newUser };
  delete user.password;

  return [201, user];
};

const loginService = async ({ email, password }) => {
  const validUser = users.find((user) => user.email === email);

  if (!validUser) {
    return [
      401,
      {
        message: "Wrong email/password",
      },
    ];
  }

  const passwordMatch = await compare(password, validUser.password);

  if (!passwordMatch) {
    return [
      401,
      {
        message: "Wrong email/password",
      },
    ];
  }

  const token = jwt.sign(
    {
      isAdm: validUser.isAdm,
      email: validUser.email,
    },
    "SECRET_KEY",
    {
      expiresIn: "24h",
      subject: validUser.uuid,
    }
  );
  return [200, { token }];
};

const getUsersAllService = () => {
  return users;
};

const getUserProfileService = (uuid) => {
  const userProfile = users.find((el) => el.uuid === uuid);
  if (!userProfile) {
    return [401, { error: "401 UNAUTHORIZED" }];
  }
  const { password, ...user } = userProfile;
  return [200, user];
};

const removeUserService = (idUserSession, idRemoveUser, isAdm) => {
  const userExist = users.findIndex((el) => el.uuid === idRemoveUser);
  if (userExist == -1) {
    return [
      404,
      {
        message: "user not found",
      },
    ];
  }

  if (!isAdm && idUserSession !== idRemoveUser) {
    return [
      403,
      {
        message: "missing admin permissions",
      },
    ];
  }

  users.splice(userExist, 1);
  return [204, ""];
};

const updatedDataUserService = (uuid, dataUpdate) => {
  const indexUserEdit = users.findIndex((el) => el.uuid === uuid);
  if (indexUserEdit === -1) {
    return [401, { message: "Missing authorization headers" }];
  }

  const editUser = {
    updatedOn: new Date(),
    name: dataUpdate.name ? dataUpdate.name : users[indexUserEdit].name,
    email: dataUpdate.email ? dataUpdate.email : users[indexUserEdit].email,
    password: dataUpdate.password
      ? hash(dataUpdate.password, 10)
      : users[indexUserEdit].password,
  };

  users[indexUserEdit] = {
    ...users[indexUserEdit],
    ...editUser,
  };

  const user = { ...users[indexUserEdit] };
  delete user.password;

  return [200, user];
};

//   controll

const createNewUserController = async (request, response) => {
  const [status, data] = await createNewUserService(request.body);

  return response.status(status).json(data);
};

const loginController = async (request, response) => {
  const [status, data] = await loginService(request.body);
  return response.status(status).json(data);
};

const getUsersAllController = (request, response) => {
  const userList = getUsersAllService();
  return response.json(userList);
};

const getUserProfileController = (request, response) => {
  const { uuid } = request.user;
  const [status, data] = getUserProfileService(uuid);

  return response.status(status).json(data);
};

const removeUserController = (request, response) => {
  const idUserSession = request.user.uuid;
  const idRemoveUser = request.params.uuid;
  const isAdm = request.user.isAdm;
  const [status, data] = removeUserService(idUserSession, idRemoveUser, isAdm);

  return response.status(status).json(data);
};

const updatedDataUserController = (request, response) => {
  const { uuid } = request.params;

  const dataUpdate = request.body;

  const [status, data] = updatedDataUserService(uuid, dataUpdate);

  return response.status(status).json(data);
};

// Routes
app.post("/users", verifyUserMiddleware, createNewUserController);
app.post("/login", loginController);
app.get(
  "/users",
  verifyTokenLoginMiddleware,
  verifyIsAdmMiddleware,
  getUsersAllController
);
app.get("/users/profile", verifyTokenLoginMiddleware, getUserProfileController);
app.delete("/users/:uuid", verifyTokenLoginMiddleware, removeUserController);
app.patch(
  "/users/:uuid",
  verifyTokenLoginMiddleware,
  verifyIsAdmOrUserMiddleware,
  updatedDataUserController
);

const PORT = 3000;
app.listen(PORT, () => console.log(`App rodando em http://localhost:${PORT}`));
export default app;
