import loginService from "../services/login.services";
export const loginController = async (request, response) => {
  const [status, data] = await loginService(request.body);
  return response.status(status).json(data);
};
