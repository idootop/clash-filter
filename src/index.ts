import { fromHono } from "chanfana";
import { Hono } from "hono";
import { ClashFilter } from "./endpoints/clash";
import { Hello } from "./endpoints/hello";

const app = new Hono<{ Bindings: Env }>();

const openapi = fromHono(app, {
  docs_url: "/openapi",
});

openapi.get("/api/clash", ClashFilter);
openapi.get("/api/hello", Hello);

export default app;
