import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user.routes.js";
import roleRouter from "./routes/role.routes.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ ok: true, name: "Sang0210 API", routes: ["/api/users", "/api/roles"] });
});

app.get("/favicon.ico", (req, res) => res.status(204).end());


// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/users", userRouter);
app.use("/api/roles", roleRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
