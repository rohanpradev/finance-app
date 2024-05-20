import { accountsRouter } from "@/app/api/[[...route]]/accounts";
import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api" }).use(accountsRouter);

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;

export type App = typeof app;
