import { OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { type AppContext } from "../../types";
import { fetchAndFilterClashConfig } from "./utils";

export class ClashFilter extends OpenAPIRoute {
  schema = {
    tags: ["ClashFilter"],
    summary: "过滤指定类型的订阅",
    request: {
      query: z.object({
        url: Str({
          description: "订阅地址",
        }),
        include: Str({
          description: "包含的节点类型",
          required: false,
        }),
        exclude: Str({
          description: "排除的节点类型",
          required: false,
        }),
        omit: Str({
          description: "忽略的配置项",
          required: false,
        }),
        config: Str({
          description: "配置文件地址",
          required: false,
        }),
      }),
    },
    responses: {
      "200": {
        description: "返回过滤后的订阅",
        content: {
          "text/yaml": {
            schema: Str(),
          },
        },
      },
      "500": {
        description: "处理配置时出错",
        content: {
          "application/json": {
            schema: z.object({
              error: Str(),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();

    if (!data.query.url) {
      return c.json({ error: "请提供订阅链接" }, 400);
    }

    try {
      const filteredConfig = await fetchAndFilterClashConfig(data.query as any);
      return c.text(filteredConfig, 200, {
        "Content-Type": "text/yaml",
        "Content-Disposition": "attachment; filename=config.yaml",
      });
    } catch (error) {
      console.error("处理请求时出错:", error);
      return c.json({ error: "处理配置时出错" }, 500);
    }
  }
}
