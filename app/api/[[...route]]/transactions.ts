import db from "@/db";
import { accounts, categories, transactions } from "@/db/schema";
import { parse, subDays } from "date-fns";
import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { clerkPlugin } from "elysia-clerk";

export const transactionsRouter = new Elysia().use(clerkPlugin()).guard(
  {
    beforeHandle({ store, error }) {
      if (!store.auth?.userId) {
        return error(401, "Unauthorized");
      }
    },
  },
  app =>
    app.group("/transactions", app =>
      app
        .get(
          "/",
          async ({ query: { from, to, accountId }, store: { auth } }) => {
            const defaultTo = new Date();
            const defaultFrom = subDays(defaultTo, 30);

            const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
            const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

            const data = await db
              .select({
                id: transactions.id,
                category: categories.name,
                categoryid: transactions.categoryId,
                payee: transactions.payee,
                amount: transactions.amountInCents,
                notes: transactions.notes,
                account: accounts.name,
                accountId: transactions.accountId,
                date: transactions.date,
              })
              .from(transactions)
              .innerJoin(accounts, eq(transactions.accountId, accounts.id))
              .leftJoin(accounts, eq(transactions.categoryId, categories.id))
              .where(
                and(
                  accountId ? eq(transactions.accountId, accountId) : undefined,
                  eq(accounts.userId, auth?.userId as string),
                  gte(transactions.date, startDate),
                  lte(transactions.date, endDate),
                ),
              );
            return data;
          },
          {
            query: t.Object({
              from: t.Optional(t.String()),
              to: t.Optional(t.String()),
              accountId: t.Optional(t.String()),
            }),
          },
        )
        .get(
          "/:id",
          async ({ error, params: { id }, store: { auth } }) => {
            const [data] = await db
              .select({
                id: transactions.id,
                categoryid: transactions.categoryId,
                payee: transactions.payee,
                amount: transactions.amountInCents,
                notes: transactions.notes,
                accountId: transactions.accountId,
                date: transactions.date,
              })
              .from(transactions)
              .innerJoin(accounts, eq(transactions.accountId, accounts.id))
              .where(and(eq(transactions.id, id), eq(accounts.userId, auth?.userId as string)));
            if (!data) return error(404, "Not Found");
            return data;
          },
          {
            params: t.Object({ id: t.String() }),
          },
        )
        .post(
          "/",
          async ({ body }) => {
            const [data] = await db.insert(transactions).values(body).returning();
            return data;
          },
          {
            body: t.Object({
              amountInCents: t.Numeric(),
              payee: t.String(),
              notes: t.String(),
              date: t.Date(),
              accountId: t.String(),
              categoryId: t.String(),
            }),
          },
        )
        .post(
          "/bulk-create",
          async ({ body }) => {
            const data = await db.insert(transactions).values(body).returning();
            return data;
          },
          {
            body: t.Array(
              t.Object({
                amountInCents: t.Numeric(),
                payee: t.String(),
                notes: t.String(),
                date: t.Date(),
                accountId: t.String(),
                categoryId: t.String(),
              }),
              { minItems: 1 },
            ),
          },
        )
        .delete(
          "/bulk-delete",
          async ({ body: { idList }, store: { auth } }) => {
            const transactionsToDelete = db.$with("transactions_to_delete").as(
              db
                .select({ id: transactions.id })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                  and(
                    inArray(transactions.id, idList),
                    eq(accounts.userId, auth?.userId as string),
                  ),
                ),
            );
            const data = await db
              .with(transactionsToDelete)
              .delete(transactions)
              .where(inArray(transactions.id, sql`(select id from ${transactionsToDelete})`))
              .returning({ id: transactions.id });
            return data;
          },
          { body: t.Object({ idList: t.Array(t.String()) }) },
        )
        .patch(
          "/:id",
          async ({ body, params: { id }, store: { auth } }) => {
            const transactionsToUpdate = db.$with("transactions_to_update").as(
              db
                .select({ id: transactions.id })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(and(eq(transactions.id, id), eq(accounts.userId, auth?.userId as string))),
            );
            const data = await db
              .with(transactionsToUpdate)
              .update(transactions)
              .set(body)
              .where(inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`))
              .returning();
            return data;
          },
          {
            params: t.Object({
              id: t.String(),
            }),
            body: t.Object({
              amountInCents: t.Optional(t.Numeric()),
              payee: t.Optional(t.String()),
              notes: t.Optional(t.String()),
              date: t.Optional(t.Date()),
              accountId: t.Optional(t.String()),
              categoryId: t.Optional(t.String()),
            }),
          },
        )
        .delete(
          "/:id",
          async ({ error, params: { id }, store: { auth } }) => {
            const transactionsToDelete = db.$with("transactions_to_delete").as(
              db
                .select({ id: transactions.id })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(and(eq(transactions.id, id), eq(accounts.userId, auth?.userId as string))),
            );
            const [data] = await db
              .with(transactionsToDelete)
              .delete(transactions)
              .where(inArray(transactions.id, sql`(select id from ${transactionsToDelete})`))
              .returning({ id: transactions.id });
            if (!data) return error(404, "Not Found");
            return data;
          },
          {
            params: t.Object({
              id: t.String(),
            }),
          },
        ),
    ),
);
