import { createServer, type Server, type ServerResponse } from "node:http";
import { watch, mkdirSync } from "node:fs";
import { join } from "node:path";
import { loadState, STATE_DIR } from "./state.js";
import { PAGE } from "./dashboard.js";

export interface RunningServer {
  server: Server;
  port: number;
  close(): void;
}

export async function startServer(root: string, port = 4317): Promise<RunningServer> {
  const clients = new Set<ServerResponse>();
  const stateDir = join(root, STATE_DIR);
  mkdirSync(stateDir, { recursive: true });

  let timer: NodeJS.Timeout | undefined;
  const watcher = watch(stateDir, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const res of clients) res.write("data: change\n\n");
    }, 100);
  });

  const server = createServer(async (req, res) => {
    const url = req.url ?? "/";
    if (url === "/api/state") {
      res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify(await loadState(root)));
    } else if (url === "/events") {
      res.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-store",
        connection: "keep-alive",
      });
      res.write("retry: 1000\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
    } else if (url === "/") {
      res.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; img-src data:",
      });
      res.end(PAGE);
    } else {
      res.writeHead(404).end();
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  const addr = server.address();
  return {
    server,
    port: typeof addr === "object" && addr ? addr.port : port,
    close() {
      clearTimeout(timer);
      watcher.close();
      for (const res of clients) res.end();
      server.close();
    },
  };
}
