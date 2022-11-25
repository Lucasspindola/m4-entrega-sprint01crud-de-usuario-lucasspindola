import express from "express";
import { v4 as uuidV4 } from "uuid";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
const users = [];

const app = express();
app.use(express.json());
// Middleware
const verifyTokenLoginMiddleware = (request, response, next) => {
  const token = request.headers.authorization;
  console.log(token);
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
    const dataUser = {
      uuid: decoded.sub,
      email: decoded.email,
      isAdm: decoded.isAdm,
    };
    request.user = dataUser;
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
  return [201, newUser];
};

const loginService = async ({ email, password }) => {
  const validUser = users.find((user) => user.email === email);
  if (!validUser) {
    return [401, { error: "401 UNAUTHORIZED" }];
  }
  const passwordMatch = await compare(password, validUser.password);
  if (!passwordMatch) {
    return [401, { error: "401 UNAUTHORIZED" }];
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
app.post("/users", verifyUserMiddleware, createNewUserController);
app.post("/login", loginController);
app.get(
  "/users",
  verifyTokenLoginMiddleware,
  verifyIsAdmMiddleware,
  getUsersAllController
);
app.get("/users/profile", verifyTokenLoginMiddleware, getUserProfileController);
app.patch("/users/<uuid>", verifyTokenLoginMiddleware);
const PORT = 3000;
app.listen(PORT, () => console.log(`App rodando em http://localhost:${PORT}`));
export default app;

// Método	Endpoint	Responsabilidade
// POST	/users	Criação de usuários
// POST	/login	Gera um token JWT recebendo email e password no corpo da requisição como JSON.
// GET	/users	Lista todos os usuários
// GET	/users/profile	Retorna os dados do usuário logado (usuário a qual pertence o token que será necessário neste endpoint)
// PATCH	/users/<uuid>	Atualiza os dados de um usuário
// DELETE	/users/<uuid>	Deleta usuários do banco

// instalados novos
// yarn add bcryptjs@2.4.3

// yarn add jsonwebtoken@8.5.1
