import { Response, NextFunction } from "express";
import { PostViewsService } from "./post-views.service";
import { Inject, Service } from "typedi";
import { Pagination, HandleResponse } from "../../../helpers/response";
import { AuthRequest } from "../../auth/auth.services";

@Service ()
export class PostViewsController {
    @Inject()
    private readonly postViewsService!: PostViewsService;
    getPostViewed = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit, offset } = Pagination.paginationReq(req);
            const userId = Number(req.userId);
            const data = await this.postViewsService.getPostViewed(userId, limit, offset);
            return res.send(new HandleResponse(data, undefined, new Pagination(page, limit, data?.length)))
        } catch (error) {
            next(error);
        }
    }
}