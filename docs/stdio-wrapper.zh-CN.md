# StdIO 包装器与非 JSON 日志过滤

当 MCP 主机运行此服务器时，它期望 stdout/stdin 上为纯 JSON-RPC 流。如果有人类可读的日志行写入到了 stdout，上述主机的 JSON 解析将失败并出现类似以下错误：

```
Error: Unexpected token 'C', "Connecting"... is not valid JSON
```

本仓库包含 `wrap-stdio.js`，它作为包装器启动 `index.js` 子进程并提供两个有用的功能：

- 将能被解析为有效 JSON 的行路由到包装器的 stdout（使 MCP 主机仅接收到 JSON 消息）。
- 将非 JSON 的行写入 stderr，并追加到 `mcp-child.log` 以便后续排查。

为什么使用包装器

- 许多日志工具或意外的 console.log 调用可能会将文本写到 stdout。包装器通过只允许 JSON 行通过 stdout 来保护主机。
- 包装器是一个低风险的 适配层，无需修改服务端代码。

工作原理

- 包装器以子进程方式运行 `node index.js`。
- 它逐行读取子进程的 stdout 和 stderr。
- 如果一行是有效的 JSON（JSON.parse 成功），包装器会将该行写入自身的 stdout。
- 否则，包装器将该行写入 stderr，并保存到 `mcp-child.log`。

运行包装器

PowerShell（Windows）：

```powershell
# 运行包装器并启动 MCP 服务，包装器会过滤 stdout
node wrap-stdio.js
```

Bash（Linux / WSL / macOS）：

```bash
node wrap-stdio.js
```

在外部主机中使用包装器

如果外部 MCP 主机负责启动服务器，请将主机配置为运行包装器，这样主机将得到干净的 JSON 流。示例主机进程配置（JSON）：

```json
{
  "command": "C:\\nvm4w2\\nodejs\\node.exe",
  "args": ["C:\\mcp\\mysql-mcp\\wrap-stdio.js"],
  "transport": "stdio"
}
```

替代方案：将日志写到 stderr

如果您能控制服务器实现且不想使用包装器，请确保所有人类可读的日志都写入 stderr。例如使用 console.error 或配置日志库写入 stderr。这样 MCP 主机只会在 stdout 上看到 JSON。

故障排查

- “Unexpected token” JSON 错误：原因通常是 stdout 上出现非 JSON 文本。使用包装器或将日志移到 stderr。
- 包装器无法启动：确保系统中已安装 Node.js，或者使用 `node wrap-stdio.js` 显式启动包装器。
- 诊断问题时请查看 `mcp-child.log`，其中记录了子进程的 stdout/stderr 历史。

实现说明

- 包装器体积小巧，使用同步的 appendFile 调用以尽量避免在进程退出时丢失日志条目。
- 它会将信号（SIGINT、SIGTERM、SIGHUP）转发给子进程，以便子进程能正常退出。

