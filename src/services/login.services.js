import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../database.js";
import "dotenv/config";
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
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
      subject: validUser.uuid,
    }
  );
  return [200, { token }];
};

export default loginService;
