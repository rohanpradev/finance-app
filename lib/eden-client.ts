import type { App } from "@/app/api/[[...route]]/route";
import { treaty } from "@elysiajs/eden";

const client = treaty<App>(process.env.NEXT_PUBLIC_APP_URL as string);

export default client;
