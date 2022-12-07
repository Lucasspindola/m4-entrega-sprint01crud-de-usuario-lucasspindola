import users from "../database.js";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
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
export default createNewUserService;
