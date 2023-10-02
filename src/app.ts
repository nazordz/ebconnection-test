import "module-alias/register";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import createHttpError from "http-errors";
import {
  CustomSchema,
  CustomValidationChain,
  ExpressValidator,
  body,
  check,
  checkSchema,
  param,
} from "express-validator";

import {
  authLogin,
  currentUser,
  refreshToken,
} from "./controllers/authController";
import { createUser, listUser } from "./controllers/userController";
import { verifyJwt } from "./middlewares/authJwt";
import { isAdmin } from "./middlewares/roleMiddleware";
import {
  createTicket,
  doneTicket,
  listTicket,
} from "./controllers/ticketController";
import { acceptWo, createWo, doneWo, listWo } from "./controllers/workOrderController";
import { sendNotif } from "./controllers/notificationController";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || "8080";

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
const limiter = rateLimit({
  max: 1000,
  windowMs: 1 * 60 * 1000,
  message: createHttpError(
    429,
    "Too many requests from this IP, please try again in an 1 minutes"
  ),
});
app.use("*", limiter);

app.use(express.json());
// routes

app.get("/api/users", [verifyJwt, isAdmin], listUser);
app.post(
  "/api/auth/login",
  checkSchema(
    {
      username: {
        notEmpty: true,
        errorMessage: "username is required",
      },
      password: { notEmpty: true, errorMessage: "password is required" },
    },
    ["body"]
  ),
  authLogin
);
app.post("/api/auth/refresh", verifyJwt, refreshToken);
app.get("/api/auth/user", verifyJwt, currentUser);

app.post(
  "/api/tickets",
  verifyJwt,
  checkSchema({
    issue: {
      notEmpty: true,
      errorMessage: "issue is required",
    },
    key: {
      notEmpty: true,
      errorMessage: "key is required",
    },
  }),
  createTicket
);

app.get("/api/tickets", verifyJwt, listTicket);
app.post(
  "/api/tickets/done",
  verifyJwt,
  body("ticket_id").notEmpty().withMessage("ticket_id is required"),
  doneTicket
);

app.get("/api/work-orders", verifyJwt, listWo);
app.post(
  "/api/work-orders",
  verifyJwt,
  body("ticket_id").notEmpty().withMessage("ticket_id is required"),
  createWo
);
app.post(
  "/api/work-orders/accept",
  verifyJwt,
  body("work_order_id").notEmpty().withMessage("work_order_id is required"),
  acceptWo
);
app.post(
  "/api/work-orders/done",
  verifyJwt,
  body("work_order_id").notEmpty().withMessage("work_order_id is required"),
  doneWo
);

app.post(
    "/api/notif",
    verifyJwt,
    body("user_id").notEmpty().withMessage("user_id is required"),
    sendNotif
)

// route not found
app.all("*", (req, res, next) => {
  next(createHttpError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
