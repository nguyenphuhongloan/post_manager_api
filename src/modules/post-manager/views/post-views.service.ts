import { Inject, Service } from "typedi";
import { PostViewsCache } from "./cache/post-views.cache"

@Service()
export class PostViewsService {
    @Inject()
    postViewedCache!: PostViewsCache;
    getPostViewed = async (userId: number, limit: number, offset: number) => {
        return await this.postViewedCache.getPostsViewed(userId, limit, offset);
    }
}