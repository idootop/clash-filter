# ClashFilter

一个基于 Cloudflare Worker 的小工具，用来过滤 Clash 订阅中指定类型的节点。

## 动机

不久前我入手了一台小米路由器 BE3600 开启了 SSH， 并安装了 ShellClash 用于全局透明代理。

有些机场的节点类型可能会包含 `vless`、`hysteria` 等协议，需要 clash meta 内核才能支持。

但由于该路由器内存有限（空闲时 40mb 左右），启用 clash meta 内核后，内存将很快被耗尽，导致路由器频繁崩溃重启。

无奈，做了个小工具来过滤出 clash 内核支持的基础节点类型：`ss`, `ssr`, `trojan`, `vmess`, `socks5`, `http`, `snell`。

并且禁用了 `scripts`, `proxy-providers`, `rule-providers` 和 `rule-set` 等只有 clash meta 内核才有的高级特性。

## 请求参数

请求路径：`https://your-domain.com/api/clash`

1. url：订阅地址
2. include：要保留的节点类型，比如：`ss,trjan,vmess`
3. exclude：要丢弃的节点类型，比如：`vless,hysteria`

## License

[MIT](LICENSE) License © 2025-PRESENT Del Wang


tar -czvf /tmp/clash.tar.gz /data/ShellCrash/

ssh -o HostKeyAlgorithms=+ssh-rsa root@192.168.31.1 "dd if=/tmp/clash.tar.gz" | dd of=clash.tar.gz
