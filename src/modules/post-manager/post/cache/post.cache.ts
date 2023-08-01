import { Inject, Service } from "typedi";

import { Post, StatusPost } from "../entities/post.entity";
import { Redis } from "../../../redis/redis.services";

@Service()
export class PostCache {
    @Inject()
    private readonly redis!: Redis;

    private readonly keyPost = "Post";

    private readonly getKeyPost = (postId: number) => `${this.keyPost}:${postId}`;

    setPostCache = async (post: Post) => {
        const postCache = Post.convertAndExcludeExtraneousValues(post);
        const strPost = JSON.stringify(postCache);
        await this.redis.setKey(this.getKeyPost(post.postId), strPost);
    }

    deletePostCache = async (postId: number) => {
        await this.redis.deleteKey(this.getKeyPost(postId));
    }

    getPostCache = async (postId: number) => {
        const strPost = await this.redis.getKeyValue(this.getKeyPost(postId));
        if (!strPost) return null;
        const post = Post.convert(JSON.parse(strPost));
        return post.status == StatusPost.Published ? post : null;
    }
}