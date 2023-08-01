import { Inject, Service } from "typedi";
import { PostCreate } from "./dto/post-create.dto";
import { Post, StatusPost } from "./entities/post.entity";
import { PostUpdate } from "./dto/post-update.dto";
import { Err } from "../../../helpers/error";
import { Comment } from "../../comment-manager/comment/entities/comment.entity";
import { PostViewsCache } from "../views/cache/post-views.cache";
import { PostView } from "../views/entities/post-views.entity";
import { PostCache } from "./cache/post.cache";
import AppDataSource from "../../../database/connection";
import { EntityManager } from "typeorm";
import { Category } from "../../category/entities/category.entity";

@Service()
export class PostService {
    @Inject()
    private readonly postCache!: PostCache;

    @Inject()
    private readonly postViewsCache!: PostViewsCache;

    createPost = async (post: PostCreate) => {
        const postPayload = Post.convert(post);
        const category = await Category.findOne({ where: { categoryId: postPayload.category, isDeleted: 0 } });
        if (!category)
            throw Err.CategoryNotFound;
        const data = await Post.save(postPayload);
        this.postCache.setPostCache(data);
        return data;
    }

    updatePost = async (post: PostUpdate) => {
        const postRes = await Post.findOne({ where: { postId: post.postId } });
        if (!postRes)
            throw Err.PostNotFound;
        const postPayload = Post.convert(post);
        const category = await Category.findOne({ where: { categoryId: postPayload.category, isDeleted: 0 } });
        if (!category)
            throw Err.CategoryNotFound;
        const dataRes = AppDataSource.transaction(async (trans: EntityManager) => {
            this.postCache.deletePostCache(postPayload.postId);
            await Post.update({ postId: postPayload.postId }, postPayload);
            const data = await Post.findOne({ where: { postId: postPayload.postId } });
            this.postCache.setPostCache(data!);
            return data;
        });
        return dataRes;
    }

    viewPostId = async (postId: number, userId: number) => {
        await this.postViewsCache.setPostViewed(userId, postId);
        const postCache = await this.postCache.getPostCache(postId);
        if (postCache) {
            const totalViews = await PostView.procIncreseView(postId);
            const totalComments = await Comment.procGetTotalComments(postId);
            return {
                ...postCache,
                totalViews: totalViews,
                totalComments: totalComments
            };
        }
        const data = await Post.procViewPostId(postId);
        this.postCache.setPostCache(data);
        return data;
    }

    getPostsByCategory = async (category: number, limit: number, offset: number) => {
        const data = await Post.procGetPostsByCategory(category, limit, offset!);
        return data;
    }

    getPostsByTitleKeyword = async (keyword: string, limit: number, offset: number) => {
        const data = await Post.procGetPostsByTitleKeyword(keyword, limit, offset!);
        return data;
    }

    getPostsByTag = async (keyword: string, limit: number, offset: number) => {
        const data = await Post.procGetPostsByTag(keyword, limit, offset!);
        return data;
    }

    statisticViewsAndComments = async (limit: number, offset: number) => {
        const data = await Post.statisticViewAndComment(limit, offset!);
        return data;
    }
}