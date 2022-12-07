import users from "../database";
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

export default removeUserService;
