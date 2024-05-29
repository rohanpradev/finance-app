import { Elysia } from "elysia";
import { accountsRouter } from "./accounts";
import { categoriesRouter } from "./categories";
import { transactionsRouter } from "./transactions";

const app = new Elysia({ prefix: "/api" })
  .use(accountsRouter)
  .use(categoriesRouter)
  .use(transactionsRouter);

export const GET = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;

export type App = typeof app;
