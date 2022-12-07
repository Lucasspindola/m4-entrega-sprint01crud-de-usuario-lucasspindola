import createNewUserService from "../services/createNewUserService.services";
import getUsersAllService from "../services/getUsersAllService.services";
import getUserProfileService from "../services/getUserProfileService.services";
import removeUserService from "../services/removeUserService.services";
import updatedDataUserService from "../services/updatedDataUserService.services";

export const createNewUserController = async (request, response) => {
  const [status, data] = await createNewUserService(request.body);

  return response.status(status).json(data);
};
export const getUsersAllController = (request, response) => {
  const userList = getUsersAllService();
  return response.json(userList);
};

export const getUserProfileController = (request, response) => {
  const { uuid } = request.user;
  const [status, data] = getUserProfileService(uuid);

  return response.status(status).json(data);
};

export const removeUserController = (request, response) => {
  const idUserSession = request.user.uuid;
  const idRemoveUser = request.params.uuid;
  const isAdm = request.user.isAdm;
  const [status, data] = removeUserService(idUserSession, idRemoveUser, isAdm);

  return response.status(status).json(data);
};

export const updatedDataUserController = (request, response) => {
  const { uuid } = request.params;

  const dataUpdate = request.body;

  const [status, data] = updatedDataUserService(uuid, dataUpdate);

  return response.status(status).json(data);
};
