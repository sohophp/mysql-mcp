import { describe, it, expect } from 'vitest';
import { getTools, createCallToolHandler } from '../index.js';

describe('MCP tools', () => {
  it('exposes the expected tool names', () => {
    const tools = getTools();
    const names = tools.map(t => t.name).sort();
    expect(names).toEqual(["describe_table","list_tables","show_indexes"].sort());
  });
});

describe('CallTool handler', () => {
  it('handles list_tables', async () => {
    const rows = [{ Tables_in_db: 't1' }, { Tables_in_db: 't2' }];
    const conn = {
      query: async (sql) => [rows],
      release: () => { calledRelease = true; }
    };
    let calledRelease = false;
    const pool = {
      getConnection: async () => conn
    };

    const handler = createCallToolHandler(pool);
    const res = await handler({ params: { name: 'list_tables', arguments: {} } });
    expect(res).toHaveProperty('content');
    expect(res.content[0].value).toBe(rows);
    expect(calledRelease).toBe(true);
  });

  it('handles describe_table', async () => {
    const rows = [{ Field: 'id', Type: 'int' }];
    const conn = {
      query: async (sql) => [rows],
      release: () => { calledRelease = true; }
    };
    let calledRelease = false;
    const pool = { getConnection: async () => conn };

    const handler = createCallToolHandler(pool);
    const res = await handler({ params: { name: 'describe_table', arguments: { table: 'users' } } });
    expect(res.content[0].value).toBe(rows);
    expect(calledRelease).toBe(true);
  });

  it('handles show_indexes', async () => {
    const rows = [{ Key_name: 'PRIMARY' }];
    const conn = {
      query: async (sql) => [rows],
      release: () => { calledRelease = true; }
    };
    let calledRelease = false;
    const pool = { getConnection: async () => conn };

    const handler = createCallToolHandler(pool);
    const res = await handler({ params: { name: 'show_indexes', arguments: { table: 'users' } } });
    expect(res.content[0].value).toBe(rows);
    expect(calledRelease).toBe(true);
  });

  it('throws on unknown tool', async () => {
    const conn = {
      query: async (sql) => [[]],
      release: () => {}
    };
    const pool = { getConnection: async () => conn };
    const handler = createCallToolHandler(pool);
    await expect(handler({ params: { name: 'nonexistent', arguments: {} } })).rejects.toThrow(/Unknown tool/);
  });
});

