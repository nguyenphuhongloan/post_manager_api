import { Inject, Service } from "typedi";
import { PostSavedService } from "./post-saved.service";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../../auth/auth.services";
import { HandleResponse, Pagination } from "../../../helpers/response";
import { isBoolean, isNumber } from "class-validator";
import { PostSavedUpdate } from "./dto/post-saved-update.dto";

@Service()
export class PostSavedController {
    @Inject()
    private readonly postSavedService!: PostSavedService;

    savedPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const postSaved = req.body as PostSavedUpdate;
            postSaved.userId = Number(req.userId);
            postSaved.postId = Number(req.params.postId);
            const data = await this.postSavedService.savePost(postSaved);
            return res.send(new HandleResponse(data))
        } catch (error) {
            next(error);
        }
    }

    getSavedPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit, offset } = Pagination.paginationReq(req);
            const userId = Number(req.userId);
            const { data, total } = await this.postSavedService.getSavedPost(userId, limit, offset);
            return res.send(new HandleResponse(data, undefined, new Pagination(page, limit, total)))
        } catch (error) {
            next(error);
        }
    }
}