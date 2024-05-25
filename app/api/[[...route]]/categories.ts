import db from "@/db";
import { categories } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { clerkPlugin } from "elysia-clerk";

export const categoriesRouter = new Elysia().use(clerkPlugin()).guard(
  {
    beforeHandle({ store, error }) {
      if (!store.auth?.userId) {
        return error(401, "Unauthorized");
      }
    },
  },
  app =>
    app.group("/categories", app =>
      app
        .get("/", async () => {
          const data = await db.query.categories.findMany({ columns: { id: true, name: true } });
          return data;
        })
        .get(
          "/:id",
          async ({ params: { id }, store: { auth }, error }) => {
            const data = await db.query.categories.findFirst({
              columns: { id: true, name: true },
              where: and(eq(categories.userId, auth?.userId as string), eq(categories.id, id)),
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
              .insert(categories)
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
            const data = await db
              .delete(categories)
              .where(inArray(categories.id, idList))
              .returning();
            return data;
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
              .update(categories)
              .set({ name })
              .where(and(eq(categories.userId, auth?.userId as string), eq(categories.id, id)))
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
