mysql-mcp
=========

一个通过 stdio 暴露只读 MySQL 工具的轻量级 MCP（Model Context Protocol）服务器。

概述
----
本项目实现了一个小型的 MCP 服务（入口文件：`index.js`），提供对 MySQL 数据库的只读检查接口，适合开发、测试或简单集成场景。

要点
- 暴露诸如 `list_tables`、`describe_table`、`show_indexes` 的处理器（见 `index.js`）。
- 处理器可导出以便在单元测试中不启动 stdio 服务进行测试。

快速开始
--------
1. 安装依赖：

```bash
npm install
```

2. 若要在本地使用真实 MySQL 进行开发，请创建一个临时的开发环境文件并使用它运行服务器（详情见下文）。

开发环境配置
-------------
为了方便在开发时连接真实 MySQL，你可以创建 `.env.dev` 文件并填写数据库配置。仓库中提供了 `.env.dev.example`。

复制并编辑示例：

```bash
cp .env.dev.example .env.dev
# 编辑 .env.dev，设置 MYSQL_HOST、MYSQL_USER、MYSQL_PASSWORD、MYSQL_DATABASE
```

使用加载了 `.env.dev` 的方式启动服务器。项目在 `dev` 脚本中使用 `dotenv-cli` 在运行 `node index.js` 前加载 `.env.dev` 到 `process.env`。

以开发模式启动：

```bash
npm run dev
```

示例 `.env.dev` 内容
------------------
```
MYSQL_HOST=127.0.0.1
MYSQL_USER=readonly_user
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=your_database
```

运行测试
-------
项目使用 Vitest 编写单元测试。运行测试：

```bash
npm test
```

使用真实数据库进行集成测试
--------------------------
如果需要对真实 MySQL 进行集成测试，请在 `.env.dev` 中填写真实凭据，然后运行集成脚本或使用 `npm run dev` 启动服务并通过 MCP 客户端进行交互。

安全说明
-------
- 请不要将含有凭据的 `.env.dev` 提交到版本控制。使用 `.env.dev.example` 来共享配置模板。
- CI 或共享环境请使用平台提供的密钥管理功能。

仓库结构
-------
- `index.js` — 主服务代码，导出工厂函数以便测试
- `test/` — 单元测试（如 `test/index.test.js`）
- `scripts/` — 辅助脚本（例如集成测试运行器）
- `package.json` — 脚本与依赖

推荐的 `.gitignore`
-----------------
```
node_modules/
.env
.env.*
.DS_Store
```

排错
---
- 若服务无法启动，确保安装了 Node.js（建议 v16+）并运行了 `npm install`。
- 若数据库连接失败，请检查 `.env.dev` 中的凭据，并确认 MySQL 允许来自当前主机的连接。
- 测试失败时可使用 `npm test -- -t <name>` 运行特定测试。

贡献
---
欢迎贡献：提交 issue 或带测试的小 PR。请保持改动小而清晰，并为新增行为添加测试。

许可证
---
MIT

