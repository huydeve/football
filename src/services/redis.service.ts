import { createClient } from 'redis'

const client = createClient({
    url: `rediss://football.redis.cache.windows.net:6380`,
    password: `DvtsKxnJU8rSL7xohe6PSSAH9fQ0YOacIAzCaHYxE6g=`
}); // create a Redis client


export async function setResponse(key: string, value: string[]) {

    client.set(key, JSON.stringify(value), {
        EX: 300, NX: true,
    }
    );
}
// Set the OTP in Redis with a TTL of 5 minutes
export async function getResponse(key: string) {
    return await client.get(key)
}

export async function delResponse(key: string) {
    return await client.del(key)
}

export async function delAllResponse() {
    return await client.flushDb()

}
export default client
// Get the OTP from Redis
