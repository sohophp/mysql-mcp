# 更新日志

记录该项目中所有重要更动。

## Unreleased (2026-01-09)

### 新增
- 运行时优先从 `@modelcontextprotocol/sdk` 加载 `StdioServerTransport`，若不可用则回退到本地实现；提高对 SDK 导出/路径变动的兼容性。
- 新增 `stdio-transport.js`：一个最小的基于换行分割 JSON 的 stdio 回退实现，当 SDK 没有提供时使用。
- 新增开发文档：`README.md`（英文）与 `README.zh-CN.md`（简体中文）。
- 新增 `.env.dev.example`，展示开发/测试所需的环境变量。
- 新增 `.gitignore`：忽略 `node_modules`、`.env.dev` 与测试覆盖产物等。

### 修改
- `index.js`：移除了对 `StdioServerTransport` 的脆弱静态导入；实现动态导入并回退到本地实现；保证模块在被导入时不会自动启动主流程，便于测试。

### 测试
- 本地单元测试（Vitest）通过（5 个测试）。
- 使用 `scripts/integration-test.js` 在已填写的 `.env.dev` 上进行了集成测试，验证了对真实 MySQL 的连通性以及工具处理器（`list_tables`、`describe_table`、`show_indexes`）返回数据的正确性。

### 说明
- 本地 stdio 回退实现只提供最小接口（start/send/close + onmessage/onerror/onclose）。部署环境若有 SDK 提供更完整的 transport，会自动优先使用 SDK 的实现。

