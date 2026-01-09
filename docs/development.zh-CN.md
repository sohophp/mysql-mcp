# 开发指南

本文档说明如何开发和测试 `mysql-mcp` 项目。

## 先决条件
- Node.js 18+（推荐）
- 用于集成测试的 MySQL 数据库（可选，但推荐）

## 配置
1. 安装依赖：

```bash
npm install
```

2. 从示例复制开发环境配置文件并填写真实数据库信息（如果要运行集成测试）：

```bash
cp .env.dev.example .env.dev
# 编辑 .env.dev 并填写 MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

## 运行单元测试

```bash
npm test
```

## 在真实 MySQL 上运行集成测试

```bash
npx dotenv -e .env.dev -- node scripts/integration-test.js
```

## 代码结构
- `index.js` - MCP 服务器工厂与 CLI 入口
- `stdio-transport.js` - 当 SDK 不提供时使用的本地 stdio 回退实现
- `scripts/integration-test.js` - 对真实 MySQL DB 测试 handler 的脚本
- `test/` - 单元测试（Vitest）

## 贡献
- 保持修改小且专注；为行为更改添加测试。
- 更改公共行为时，请更新 `CHANGELOG`。

