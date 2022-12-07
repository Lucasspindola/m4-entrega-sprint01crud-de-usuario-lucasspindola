import express, { response } from "express";
import userRoutes from "./routers/users.routes";
import loginRoutes from "./routers/login.routes";
const app = express();
app.use(express.json());
app.use("", userRoutes);
app.use("", loginRoutes);
export default app;
