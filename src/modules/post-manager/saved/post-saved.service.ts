import { Service } from "typedi"
import { PostSaved } from "./entities/savedPost.entity"
import { Post, StatusPost } from "../post/entities/post.entity";
import { Err } from "../../../helpers/error";
import { PostSavedUpdate } from "./dto/post-saved-update.dto";

@Service()
export class PostSavedService {
    savePost = async (postSaved: PostSavedUpdate) => {
        const savedPostObj = { userId: postSaved.userId, postId: postSaved.postId };
        const savedPostPayload = PostSaved.convert({ ...savedPostObj, isSaved: 1 });
        const postSavedRes = await PostSaved.findOne({ where: savedPostObj });
        const post = await Post.findOne({ where: { postId: postSaved.postId, status: StatusPost.Published } });
        if (!post)
            throw Err.PostNotFound;
        if (!postSavedRes && !postSaved.isSave)
            throw Err.BadRequest;
        if (postSavedRes?.isSave == postSaved.isSave)
            throw Err.BadRequest;
        if (!postSavedRes)
            return PostSaved.save(savedPostPayload);
        await PostSaved.update({ id: postSavedRes.id }, { isSave: postSaved.isSave });
        const data = await PostSaved.findOne({ where: { id: postSavedRes.id } });
        return data;
    }

    getSavedPost = async (userId: number, limit: number, offset: number) => {
        const data = await Post.procGetSavedPost(userId, limit, offset!);
        return data;
    }
}