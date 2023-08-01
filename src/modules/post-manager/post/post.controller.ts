import { Inject, Service } from "typedi";
import { PostService } from "./post.service";
import { NextFunction, Request, Response } from "express";
import { PostUpdate } from "./dto/post-update.dto";
import { PostCreate } from "./dto/post-create.dto";
import { HandleResponse, Pagination } from "../../../helpers/response";
import { AuthRequest } from "../../auth/auth.services";
import { PostSearchType } from "./dto/post-search.dto";

@Service()
export class PostController {
    @Inject()
    private readonly postService!: PostService;

    createPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = req.body as PostCreate;
            const data = await this.postService.createPost(post);
            return res.send(new HandleResponse(data))
        } catch (error) {
            next(error);
        }
    }

    updatePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = req.body as PostUpdate;
            post.postId = Number(req.params.postId);
            const data = await this.postService.updatePost(post);
            return res.send(new HandleResponse(data))
        } catch (error) {
            next(error);
        }
    }

    viewPostId = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const postId = Number(req.params.postId);
            const userId = Number(req.userId);
            const data = await this.postService.viewPostId(postId, userId);
            return res.send(new HandleResponse(data))
        } catch (error) {
            next(error);
        }
    }

    getPostsByCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, offset } = Pagination.paginationReq(req);
            const category = Number(req.params.category);
            const { data, total } = await this.postService.getPostsByCategory(category, limit, offset);
            return res.send(new HandleResponse(data, undefined, new Pagination(page, limit, total)))
        } catch (error) {
            next(error);
        }
    }

    getPostsSearch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, offset } = Pagination.paginationReq(req);
            const keyword = req.query.keyword as string;
            let data, total;
            switch (req.query.searchBy) {
                case PostSearchType.Title:
                    ({ data, total } = await this.postService.getPostsByTitleKeyword(keyword, limit, offset));
                    break;
                case PostSearchType.Tag:
                    ({ data, total } = await this.postService.getPostsByTag(keyword, limit, offset));
            }

            return res.send(new HandleResponse(data, undefined, new Pagination(page, limit, total)))
        } catch (error) {
            next(error);
        }
    }

    statisticViewsAndComments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit, offset } = Pagination.paginationReq(req);
            const { data, total } = await this.postService.statisticViewsAndComments(limit, offset);
            return res.send(new HandleResponse(data, undefined, new Pagination(page, limit, total)))
        } catch (error) {
            next(error);
        }
    }
}
