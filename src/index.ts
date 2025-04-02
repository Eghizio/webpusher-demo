import { createServer } from "./server.js";
import { type Config, config } from "./Config.js";
import { initDatabase } from "./infrastructure/database/client.js";

// Todo: Figure out if PWA needs to be reinstalled after each App update.
// https://medium.com/google-developer-experts/workbox-4-implementing-refresh-to-update-version-flow-using-the-workbox-window-module-41284967e79c
const bootstrap = async ({ port, secrets: { cookies } }: Config) => {
  // init db. temp
  await initDatabase();

  const server = createServer(cookies);

  return server.listen(port, () => {
    console.log("\x1b[36m%s\x1b[0m", `Server is running on port ${port}`);
    console.log("\x1b[36m%s\x1b[0m", `http://localhost:${port}\n`);
  });
};

bootstrap(config).catch(console.error);
