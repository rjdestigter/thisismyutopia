import Koa from "koa";
import Router from "koa-router";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";
import todos from "./todos.json";
import { sign } from "jsonwebtoken";

const app = new Koa();
const router = new Router();
const username = "rjdestigter";
const password = "summer77";
const secret = '"De Wateren"';

router.post("/login", (ctx, next) => {
  if (
    !(
      ctx.request.body?.username === username &&
      ctx.request.body?.password === password
    )
  ) {
    ctx.response.status = 401;
    ctx.response.body = JSON.stringify({ payload: ctx.request.body });
    return;
  }

  const profile = {
    first_name: "John",
    last_name: "de Stigter",
    email: "johndestigter@gmail.com",
    id: 7,
  };

  // We are sending the profile inside the token
  var token = sign(profile, secret, { expiresIn: 60 * 5 });

  ctx.response.body = JSON.stringify({ token });

  next();
});

/**
 * Session is set to false because we are using JWTs, and don't need a session! * If you do not set this to false, the Passport framework will try and
 * implement a session
 */
router.get("/todos", (ctx, next) => {
    ctx.set("Content-type", "application/json");
    ctx.body = JSON.stringify(todos)
    next()
});

app.use(cors());
app.use(bodyParser());

app.use(jwt({ secret }).unless({ path: /login/ }));
app.use(router.routes()).use(router.allowedMethods());

app.listen(4200);
