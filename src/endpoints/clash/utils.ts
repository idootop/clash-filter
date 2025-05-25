import yaml from "js-yaml";

interface ClashProxy {
  name: string;
  type: string;
  [key: string]: any;
}

interface ClashProxyGroup {
  name: string;
  proxies: string[];
  [key: string]: any;
}

interface ClashConfig {
  proxies: ClashProxy[];
  "proxy-groups": ClashProxyGroup[];
  rules: string[];
  [key: string]: any;
}

const kClashTypes = ["ss", "ssr", "trojan", "vmess", "socks5", "http", "snell"];
const kOmitTypes = ["script", "proxy-providers", "rule-providers", "rule-set"];
const kConfigUrl =
  "https://fastly.jsdelivr.net/gh/juewuy/ShellCrash@master/rules/ShellClash.ini";
const kBaseUrl = "https://sub.d1.mk/sub?target=clash&url={url}&config={config}";

export async function fetchAndFilterClashConfig(options: {
  url: string;
  config?: string;
  include?: string;
  exclude?: string;
  omit?: string;
}): Promise<string> {
  const {
    url,
    include = "",
    exclude = "",
    omit = kOmitTypes.join(","),
    config: configUrl = kConfigUrl,
  } = options;

  try {
    const includeTypes = include.split(",");
    const excludeTypes = exclude.split(",");
    const omitTypes = omit.split(",");

    // 获取订阅内容
    const response = await fetch(
      kBaseUrl
        .replace("{url}", encodeURIComponent(url))
        .replace("{config}", encodeURIComponent(configUrl))
    );
    const configText = await response.text();

    // 解析 YAML 配置
    const config = yaml.load(configText) as ClashConfig;
    omitTypes.forEach((type) => {
      delete config[type]; // 删除 omit 配置项
    });

    if (omitTypes.includes("rule-set")) {
      // 删除 rule-set 规则
      config.rules = config.rules.filter(
        (rule) => !rule.toLowerCase().includes("rule-set")
      );
    }

    // 过滤代理节点
    const removedProxies = new Set();
    config.proxies = config.proxies.filter((proxy) => {
      const ok =
        !excludeTypes.includes(proxy.type) &&
        (kClashTypes.includes(proxy.type) || includeTypes.includes(proxy.type));
      if (!ok) {
        removedProxies.add(proxy.name);
      }
      return ok;
    });

    // 更新代理组中的节点引用
    if (config["proxy-groups"]) {
      config["proxy-groups"] = config["proxy-groups"].map((group) => {
        if (group.proxies) {
          group.proxies = group.proxies.filter(
            (proxyName) => !removedProxies.has(proxyName)
          );
        }
        return group;
      });
    }

    // 转换回 YAML 格式
    return yaml.dump(config);
  } catch (error) {
    console.error("处理 Clash 配置时出错:", error);
    throw error;
  }
}
