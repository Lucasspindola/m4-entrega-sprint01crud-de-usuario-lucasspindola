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

export default verifyIsAdmOrUserMiddleware;
