import { createServer } from "./server.js";
import { type Config, config } from "./Config.js";
import { initDatabase } from "./infrastructure/database/client.js";

const bootstrap = async ({ port, secrets: { cookies } }: Config) => {
  // init db.
  // temp
  await initDatabase();

  const server = createServer(cookies);

  // if db ready.
  return server.listen(port, () => {
    console.log("\x1b[36m%s\x1b[0m", `Server is running on port ${port}`);
    console.log("\x1b[36m%s\x1b[0m", `http://localhost:${port}\n`);
  });
};

bootstrap(config).catch(console.error);
