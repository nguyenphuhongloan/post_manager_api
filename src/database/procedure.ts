import AppDataSource from "./connection";

export enum procName {
    getUserDetail = "User_getUserDetail",
    viewPostId = "Post_viewPostId",
    getPostsByCategory = "Post_viewPostByCategory",
    getPostDetail = "Post_getPostDetail",
    getCommentDetail = "Comment_getCommentDetail",
    getSavedPost = "Post_getSavedPost",
    increaseView = "PostView_IncreaseTotalViews",
    getTotalComments = "Total_Comments_getTotalComments",
    getCommentsByPostId = "Comment_getCommentsByPostId",
    getCommentsReply = "Comment_getListReply",
    getCommentsByUserId = "Comment_getCommentsByUserId",
    getPostsByTitleKeyword = "Post_getPostsByTitleKeyword",
    getPostsByTag = "Post_getPostsByTag",
    statisticPostViewsAndComments = "Post_statisticViewsAndComments"
}

export const proc = async (procName: procName, params: Array<string | number>) => {
    const replacement = params.map(() => "?");
    const res = await AppDataSource.query(`CALL ${procName}(${replacement})`, params);
    if (res?.[0]?.[0].total)
        return Number(res[0][0].total)
    return res;
}

const getTotal = (total: any): number => {
    return Number(total?.[0]?.[0].total);
}
