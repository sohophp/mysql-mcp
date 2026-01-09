# 使用 / 运行 指南

本文档说明如何运行 `mysql-mcp` 服务器以及使用提供的脚本。

## 作为 MCP stdio 服务器运行
MCP 主机通常以 stdin/stdout 启动此进程并与之通信。

本地开发可通过加载 `.env.dev` 启动：

```bash
npm run dev
```

## 暴露的工具
- `list_tables` — 列出配置的 MySQL 数据库中的所有表
- `describe_table` — 描述表的列和类型
- `show_indexes` — 显示表的索引

## 集成脚本
要快速对真实 MySQL 实例调用 handler，请使用：

```bash
npx dotenv -e .env.dev -- node scripts/integration-test.js
```

该脚本会调用 `list_tables`，然后对检测到的第一个表运行 `describe_table` 和 `show_indexes`。

## 日志
- 服务器将错误写入 stderr，将 JSON 响应写入 stdout（以换行分割的 JSON）。在集成时使用支持此格式的工具。

