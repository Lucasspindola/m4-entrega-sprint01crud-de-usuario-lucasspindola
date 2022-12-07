import jwt from "jsonwebtoken";
import "dotenv/config";
const verifyTokenLoginMiddleware = (request, response, next) => {
  const token = request.headers.authorization;

  if (!token) {
    return response
      .status(401)
      .json({ message: "Missing authorization headers" });
  }

  const tokenValidate = token.split(" ")[1];
  jwt.verify(tokenValidate, process.env.SECRET_KEY, (error, decoded) => {
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
export default verifyTokenLoginMiddleware;
