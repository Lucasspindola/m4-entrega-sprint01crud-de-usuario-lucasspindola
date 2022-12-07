import { hash } from "bcryptjs";
import users from "../database.js";
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

export default updatedDataUserService;
