const verifyIsAdmMiddleware = (request, response, next) => {
  const isAdm = request.user.isAdm;
  if (!isAdm) {
    return response.status(403).json({ message: "missing admin permissions" });
  }
  next();
};

export default verifyIsAdmMiddleware;
