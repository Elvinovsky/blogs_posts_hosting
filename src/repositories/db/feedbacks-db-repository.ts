import {
    DeleteResult,
    ObjectId,
    WithId
} from "mongodb";
import { CommentViewModel } from "../../models/modelsComment/comment-view";
import { CommentDBModel } from "../../models/modelsComment/comment-input";
import { commentMapping } from "../../functions/commentsMapping";
import { PostDBModel } from "../../models/modelsPosts/post-input";
import {
    CommentModelClass,
    LikeModelClass,
    PostModelClass
} from "../../models/mongoose/models";
import { LikeDBInfo } from "../../models/modelsLike/like-input";

export const feedBacksRepository = {
    async testingDeleteAllComments (): Promise<DeleteResult> {
        return await CommentModelClass.deleteMany({})
    },
    async searchPostIdForComments ( postId: string ): Promise<PostDBModel | null> {
        return await PostModelClass.findOne({ _id: new ObjectId(postId) })
    },
    async getCommentById ( id: string ): Promise<CommentViewModel | null> {
        const likesArr: LikeDBInfo[] = await LikeModelClass.find({ postOrCommentId: id })
                                                           .lean()
        const disAndLikeCountArr = likesArr.map(el => {
            let likesCount = 0
            let disCount = 0
            if (el.status === "Like") {
                likesCount++
            }
            if (el.status === "Dislike") {
                disCount++
            }
            return [likesCount, disCount]
        })

        const comment = await CommentModelClass.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                likeInfo: {
                    likesCount: disAndLikeCountArr[1],
                    dislikesCount: disAndLikeCountArr[2]
                }
            }, {
                returnDocument: "after"
            })// todo userView status 
        if (!comment) {
            return null
        }
        return commentMapping(comment)
    },
    async addNewComment ( comment: CommentDBModel ): Promise<CommentViewModel> {
        const result: WithId<CommentDBModel> = await CommentModelClass.create(comment)
        return commentMapping(result)
    },
    async updateCommentById ( id: string, content: string ): Promise<boolean> {
        const result = await CommentModelClass.updateOne({ _id: new ObjectId(id) },
            { $set: { content } })
        return result.matchedCount === 1
    },
    async deleteComment ( id: string ): Promise<boolean> {
        const resultDeleted = await CommentModelClass.deleteOne({ _id: new ObjectId(id) })
        return resultDeleted.deletedCount === 1
    },
    async changeLikeTotalCounts ( id: string, likesCount: number, dislikesCount: number ) { // todo to realize
        const result = await CommentModelClass.updateOne({ _id: new ObjectId(id) },
            { $set: { "likeInfo.likesCount": likesCount } })
    }
}