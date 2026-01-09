# mysql-mcp

> English README: `README.md`

这是一个小型的 Model Context Protocol (MCP) 服务器示例，提供一些基于 MySQL 的工具（列出表、描述表结构、显示索引）。

## 文档（Docs）
- 开发指南：`docs/development.md` / `docs/development.zh-CN.md`
- 使用指南：`docs/usage.md` / `docs/usage.zh-CN.md`

(仓库同时提供英文与简体中文的 README 与 docs，链接见上方)

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

### 集成测试 / 实际 MySQL 测试
填写 `.env.dev` 后，可运行集成脚本与 helper：

```bash
npm run list-tables
npm run integration-test
```

或直接调用脚本并传入 env 文件：

```bash
node scripts/list-tables.js .env.dev
node scripts/integration-test.js .env.dev
```

> 注意：不要将包含真实凭据的 `.env.dev` 提交到仓库，使用 `.env.dev.example` 作为模板。

## 测试
使用 Vitest 运行单元测试：

```bash
npm test
```

## 文件说明
- `index.js` - MCP 服务器实现
- `stdio-transport.js` - 本地回退的 stdio 传输实现
- `scripts/` - 集成测试辅助脚本（`integration-test.js`, `list-tables.js`）
- `test/` - 单元测试

```json
{ "backlink": "README.md" }
```
