# mysql-mcp

这是一个小型的 Model Context Protocol (MCP) 服务器示例，提供一些基于 MySQL 的工具（列出表、描述表结构、显示索引）。

## 文档（Docs）
- 开发指南：`docs/development.md`
- 使用指南：`docs/usage.md`

## 功能
- 列出数据库中的表
- 描述表结构
- 显示表的索引

## 要求
- Node.js 18+（ESM）
- 能从运行该服务的环境访问的 MySQL 服务

## 配置与运行
1. 安装依赖：

```bash
npm install
```

2. 从示例拷贝 dev 环境配置文件并填写真实数据库信息：

```bash
cp .env.dev.example .env.dev
# 编辑 .env.dev，填写 MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

3. 开发模式运行：

```bash
npm run dev
```

服务器通常由 MCP host 以 stdio 方式启动并通过 stdin/stdout 通信；本仓库包含本地测试和回退实现，方便在未安装 SDK 完整 transport 导出时也能运行。

## 测试
使用 Vitest 运行单元测试：

```bash
npm test
```

## 文件说明
- `index.js` - MCP 服务器实现
- `stdio-transport.js` - 本地回退的 stdio 传输实现
- `test/` - 单元测试
