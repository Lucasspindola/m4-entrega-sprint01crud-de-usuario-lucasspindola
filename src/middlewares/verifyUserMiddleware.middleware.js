import users from "../database.js";
const verifyUserMiddleware = (request, response, next) => {
  const { email } = request.body;
  const userAlrealdyExists = users.find((user) => user.email === email);

  if (userAlrealdyExists) {
    return response.status(409).json({ message: "E-mail already registered" });
  }
  next();
};
export default verifyUserMiddleware;
