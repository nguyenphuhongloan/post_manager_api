import { Router } from "express";
import Container from "typedi";
import { PostController } from "./post.controller";

import { PostMiddleware } from "./post.middleware";
import { AuthMiddleware } from "../../auth/auth.middleware";
import savedPostRouter from "../saved/post-saved.router";
import postViewsRouter from "../views/post-views.router";



const authMiddleware = Container.get(AuthMiddleware);
const postController = Container.get(PostController);
const postMiddleware = Container.get(PostMiddleware);

const router = Router();

router.use("/saved", savedPostRouter);

router.use("/views", postViewsRouter);

router.get("/search",
    authMiddleware.verifyAccessToken,
    postMiddleware.validateQuerySearchPost,
    postController.getPostsSearch
)

router.get("/statistic/viewsAndComments",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyPermissionsAdminOrModerator,
    postController.statisticViewsAndComments
)

router.get("/:postId",
    authMiddleware.verifyAccessToken,
    postController.viewPostId
);

router.get("/category/:category",
    authMiddleware.verifyAccessToken,
    postController.getPostsByCategory
);

router.post("/",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyPermissionsAdminOrModerator,
    postMiddleware.validateCreatePost,
    postController.createPost
);

router.put("/:postId",
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyPermissionsAdminOrModerator,
    postMiddleware.validateUpdatePost,
    postController.updatePost
);

export default router;
