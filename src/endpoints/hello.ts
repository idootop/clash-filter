import { OpenAPIRoute, Str } from "chanfana";
import { type AppContext } from "../types";

export class Hello extends OpenAPIRoute {
  schema = {
    tags: ["Hello"],
    summary: "Hello",
    responses: {
      "200": {
        description: "Hello",
        content: {
          "text/plain": {
            schema: Str(),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    return c.text(c.env.HELLO || "404", 200);
  }
}
