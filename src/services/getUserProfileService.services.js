import users from "../database.js";
const getUserProfileService = (uuid) => {
  const userProfile = users.find((el) => el.uuid === uuid);
  if (!userProfile) {
    return [401, { error: "401 UNAUTHORIZED" }];
  }
  const { password, ...user } = userProfile;
  return [200, user];
};
export default getUserProfileService;
