function getEnvVarOrThrow(name: string): string {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`Environment variable ${name} is not set`);
    }
    return value;
}

function getEnvVarOrDefault(name: string, defaultValue: string): string {
    const value = process.env[name];
    return value === undefined ? defaultValue : value;
}

const ENV = {
    server: {
        port: parseInt(getEnvVarOrDefault("PORT", "8080")),
        host: getEnvVarOrDefault("HOST", "0.0.0.0"),
    },
    redis: {
        host: getEnvVarOrThrow("REDIS_HOST"),
        port: parseInt(getEnvVarOrDefault("REDIS_PORT", "6379")),
        database: parseInt(getEnvVarOrDefault("REDIS_DATABASE", "0")),
    },
} as const;

export default ENV;
