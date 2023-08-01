import { Inject, Service } from "typedi";

import { PostCache } from "../../post/cache/post.cache";
import { Redis } from "../../../redis/redis.services";

@Service()
export class PostViewsCache {
    @Inject()
    private readonly redis!: Redis;

    @Inject()
    private readonly postCache!: PostCache;

    private readonly keyViewed = "Viewed";
    private readonly ex = 30 * 24 * 60;

    private readonly getKeyViewed = (userId: number, postId: number) => `${this.keyViewed}:${userId}:${postId}`;
    private readonly getKeyViewedPatten = (userId: number) => `${this.keyViewed}:${userId}:*`;

    setPostViewed = async (userId: number, postId: number) => {
        await this.redis.setKeyEx(this.getKeyViewed(userId, postId), Date.now().toString(), this.ex);
    }

    getPostsViewed = async (userId: number, limit: number, offset: number) => {
        const lstKey = await this.redis.getKeysPattern(this.getKeyViewedPatten(userId));
        const lstTimeViewed = await Promise.all(lstKey.map(async (e) => {
            const postId = Number(e.split(':')[2]);
            const time = await this.redis.getKeyValue(e);
            return {
                postId: postId,
                time: Number(time),
            }
        }));
        if (!lstTimeViewed)
            return null;
        const lstSortTime = lstTimeViewed.filter((e) => e.time != null).sort((a, b) => b.time - a.time);
        const lstPostView = await Promise.all(lstSortTime.map(async (e) => await this.postCache.getPostCache(e.postId)));
        const res = lstPostView.filter((e) => e != null).slice(offset, offset + limit);
        return res;
    }
}