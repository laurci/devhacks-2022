import { debug } from "@meta/debug";
import { createClient } from "redis";
import ENV from "./env";


const redisUrl = `redis://${ENV.redis.host}:${ENV.redis.port}`;

const operationsClient = createClient({
    url: redisUrl,
    database: ENV.redis.database,
});

const subscriptionsClient = createClient({
    url: redisUrl,
    database: ENV.redis.database,
});

export async function startRedis() {
    await operationsClient.connect();
    await subscriptionsClient.connect();

    debug!("Connected to redis", ENV.redis.host, ENV.redis.port, ENV.redis.database);

}
