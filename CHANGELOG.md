# Changelog

All notable changes to this project will be documented in this file.

## Unreleased (2026-01-09)

### Added
- Load `StdioServerTransport` from `@modelcontextprotocol/sdk` at runtime when available; fall back to a local implementation when not. This makes the transport resilient to SDK export/path changes.
- Added `stdio-transport.js` — a minimal newline-delimited JSON stdio transport fallback used when the SDK doesn't provide one.
- Added developer docs: `README.md` (English) and `README.zh-CN.md` (简体中文).
- Added `.env.dev.example` to show required environment variables for development/testing.
- Added `.gitignore` to ignore `node_modules`, `.env.dev` and test coverage artifacts.

### Changed
- `index.js`: removed fragile static SDK import of `StdioServerTransport`; implemented a dynamic import with fallback and ensured the module is safe to import in tests (main entrypoint only runs on direct execution).

### Testing
- Unit tests (Vitest) pass locally (5 tests).
- Performed integration test using `scripts/integration-test.js` with a filled `.env.dev` to verify real MySQL connectivity and that tool handlers (`list_tables`, `describe_table`, `show_indexes`) return correct data.

### Notes
- The local stdio transport intentionally implements a minimal surface (start/send/close + onmessage/onerror/onclose). If a richer transport is shipped by the SDK in your runtime environment, it will be used automatically.



