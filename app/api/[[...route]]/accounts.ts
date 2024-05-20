import db from "@/db";
import { accounts } from "@/db/schema";
import { Elysia, t } from "elysia";
import { clerkPlugin } from "elysia-clerk";

export const accountsRouter = new Elysia().use(clerkPlugin()).guard(
  {
    beforeHandle({ store, set }) {
      if (!store.auth?.userId) {
        set.status = 401;
        return { error: "Unauthorized" };
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
        ),
    ),
);
