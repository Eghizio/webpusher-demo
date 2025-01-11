export type Environment = "production" | "development" | "test";

export class Config {
  readonly environment: Environment;
  readonly port: number;

  readonly database: {
    readonly host: string;
    readonly user: string;
    readonly password: string;
    readonly database: string;
  };

  readonly secrets: {
    readonly cookies: string;
    readonly vapidKeyPublic: string;
    readonly vapidKeyPrivate: string;
  };

  constructor() {
    this.environment = this.toEnvironment(
      this.readEnv("NODE_ENV", "development")
    );

    this.port = this.normalizePort(this.readEnv("PORT", "3000"));

    this.database = {
      host: this.readEnv("DATABASE_HOST"),
      user: this.readEnv("DATABASE_USER"),
      password: this.readEnv("DATABASE_PASSWORD"),
      database: this.readEnv("DATABASE_NAME"),
    };

    this.secrets = {
      cookies: this.readEnv("COOKIE_SECRET"),
      vapidKeyPublic: this.readEnv("VAPID_KEY_PUBLIC"),
      vapidKeyPrivate: this.readEnv("VAPID_KEY_PRIVATE"),
    };

    this.logSafeConfig();
  }

  private readEnv(name: string, defaultValue?: string): string {
    const value = process.env[name];

    if (!value) {
      if (defaultValue) {
        return defaultValue;
      } else {
        throw new Error(`Missing environment variable: ${name}`);
      }
    }

    return value;
  }

  private logSafeConfig() {
    const safeConfig = { environment: this.environment, port: this.port };
    console.log(`Loaded config: ${JSON.stringify(safeConfig, null, 2)}`);
  }

  private toEnvironment(environment: string): Environment {
    switch (environment) {
      case "production": {
        return environment;
      }
      case "development": {
        return environment;
      }
      case "test": {
        return environment;
      }
      default: {
        throw new Error(`Unknown environment "${environment}".`);
      }
    }
  }

  private normalizePort(port: string): number {
    const parsedPort = parseInt(port, 10);

    if (isNaN(parsedPort)) {
      throw new Error(`Invalid port of "${port}"`);
    }

    const minPort = 0;
    const maxPort = 65_535;

    if (parsedPort < minPort || parsedPort > maxPort) {
      throw new Error(`Port "${parsedPort}" out of range.`);
    }

    return parsedPort;
  }
}

export const config = new Config();
