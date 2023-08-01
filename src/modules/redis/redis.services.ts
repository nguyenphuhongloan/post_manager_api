import * as redis from 'redis';
import { Service } from 'typedi';

@Service()
export class Redis {

    client = redis.createClient();

    constructor() {
        this.connect();
    }

    connect = async () => {
        this.client.on("error", (err: Error) => {
            console.log(err)
        })

        this.client.on("connected", () => {
            console.log("connected")
        })

        this.client.on("ready", () => {
            console.log("Redis ready")
        })

        this.client.connect();
    }

    setKey = async (key: string, value: string) => {
        return await this.client.set(key, value);
    }

    setKeyEx = async (key: string, value: string, ex: number) => {
        return await this.client.setEx(key, ex, value);
    }

    deleteKey = async (key: string) => {
        await this.client.del(key);
    }

    getKeyValue = async (key: string) => {
        return await this.client.get(key);
    }

    getKeysPattern = async (pattern: string) => {
        return await this.client.keys(pattern)
    }

    hSetField = async (key: string, field: string | number, value: string) => {
        return await this.client.hSet(key, field, value);
    }

    hGetField = async (key: string, field: string) => {
        return this.client.hGet(key, field);
    }

    hDelField = async (key: string, field: string) => {
        await this.client.hDel(key, field);
    }
}