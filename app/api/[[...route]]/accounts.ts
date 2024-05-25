import db from "@/db";
import { accounts } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { clerkPlugin } from "elysia-clerk";

export const accountsRouter = new Elysia().use(clerkPlugin()).guard(
  {
    beforeHandle({ store, error }) {
      if (!store.auth?.userId) {
        return error(401, "Unauthorized");
      }
    },
  },
  app =>
    app.group("/accounts", app =>
      app
        .get("/", async () => {
          const data = await db.query.accounts.findMany({ columns: { id: true, name: true } });
          return data;
        })
        .get(
          "/:id",
          async ({ params: { id }, store: { auth }, error }) => {
            const data = await db.query.accounts.findFirst({
              columns: { id: true, name: true },
              where: and(eq(accounts.userId, auth?.userId as string), eq(accounts.id, id)),
            });
            if (!data) {
              return error(404, "Not Found");
            }
            return data;
          },
          {
            params: t.Object({
              id: t.String(),
            }),
          },
        )
        .post(
          "/",
          async ({ body: { name }, store: { auth } }) => {
            const [data] = await db
              .insert(accounts)
              .values({ name, userId: auth?.userId as string })
              .returning();
            return data;
          },
          {
            body: t.Object({
              name: t.String(),
              plaidId: t.Optional(t.String()),
            }),
          },
        )
        .delete(
          "/",
          async ({ body: { idList } }) => {
            await db.delete(accounts).where(inArray(accounts.id, idList)).returning();
            return { message: "Deleted accounts successfully" };
          },
          {
            body: t.Object({
              idList: t.Array(t.String(), { minItems: 1 }),
            }),
          },
        )
        .patch(
          "/:id",
          async ({ params: { id }, body: { name }, store: { auth }, error }) => {
            const [data] = await db
              .update(accounts)
              .set({ name })
              .where(and(eq(accounts.userId, auth?.userId as string), eq(accounts.id, id)))
              .returning();
            if (!data) {
              return error(404, "Not Found");
            }
            return data;
          },
          {
            params: t.Object({
              id: t.String(),
            }),
            body: t.Object({
              name: t.String(),
            }),
          },
        ),
    ),
);
