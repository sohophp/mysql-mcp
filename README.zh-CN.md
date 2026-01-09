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

```powershell
npm install
```

2. 从示例拷贝 dev 环境配置文件并填写真实数据库信息：

```powershell
copy .env.dev.example .env.dev
# 编辑 .env.dev，填写 MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

3. 开发模式运行：

```powershell
npm run dev
```

### 本地测试与诊断
- 列出表：

```powershell
npm run list-tables
```

- 如果在使用主机名时出现超时，可临时将 `MYSQL_HOST` 设置为解析出的 IP 以排查是名称解析还是网络连通问题：

```powershell
$env:MYSQL_HOST='172.30.178.29'; npm run list-tables
```

- 项目提供了一个诊断脚本用于从 Node 进程验证 DNS 与 TCP 连通性：

```powershell
# 直接指定主机名与端口
node scripts/diagnose-host.js rocky.wsl 3306

# 若想通过指定的 .env 文件提供环境变量，请使用 dotenv-cli：
# PowerShell 中避免使用 ||，使用 ; 或分行执行
npx dotenv -e .env.dev -- node scripts/diagnose-host.js rocky.wsl 3306
```

> 注意：PowerShell 中常见的 bash 风格链式操作（如 `||`）并不适用；请使用 `;` 或将命令分成多行。

### 集成测试 / 实际 MySQL 测试
填写 `.env.dev` 后，可运行集成脚本与 helper：

```powershell
npm run list-tables
npm run integration-test
```

或直接调用脚本并传入 env 文件：

```powershell
npx dotenv -e .env.dev -- node scripts/list-tables.js
npx dotenv -e .env.dev -- node scripts/integration-test.js
```

> 注意：不要将包含真实凭据的 `.env.dev` 提交到仓库，使用 `.env.dev.example` 作为模板。

## 测试
使用 Vitest 运行单元测试：

```powershell
npm test
```

## 文件说明
- `index.js` - MCP 服务器实现
- `stdio-transport.js` - 本地回退的 stdio 传输实现
- `scripts/` - 集成测试辅助脚本（`integration-test.js`, `list-tables.js`, `diagnose-host.js`）
- `test/` - 单元测试

```json
{ "backlink": "README.md" }
```
