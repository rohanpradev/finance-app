import { accountsRouter } from "@/app/api/[[...route]]/accounts";
import { categoriesRouter } from "@/app/api/[[...route]]/categories";
import { Elysia } from "elysia";

const app = new Elysia({ prefix: "/api" }).use(accountsRouter).use(categoriesRouter);

export const GET = app.handle;
export const POST = app.handle;
export const PATCH = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;

export type App = typeof app;
