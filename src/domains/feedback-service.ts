import { CommentViewModel } from "../models/modelsComment/comment-view";
import { feedBacksRepository } from "../repositories/db/feedbacks-db-repository";
import { usersRepository } from "../repositories/db/users-db-repository";
import { UserViewModel } from "../models/modelsUsersLogin/user-view";
import {
    CommentatorInfo,
    CommentDBModel
} from "../models/modelsComment/comment-input";
import { PostDBModel } from "../models/modelsPosts/post-input";
import { userMapping } from "../functions/usersMapping";

export class FeedbackService {
    async getComment ( id: string ): Promise<CommentViewModel | null> {
        return await feedBacksRepository.getCommentById(id)
    }
    async findUserForComment ( userId: string ): Promise<UserViewModel | null> {
        const user = await usersRepository.findUserForComment(userId)
        if (!user) return null
        return userMapping(user)
    }
    async findPostIdForComments ( postId: string ): Promise<PostDBModel | null> {
        return await feedBacksRepository.searchPostIdForComments(postId)
    }
    async createComment ( postId: string, userId: string, content: string, ): Promise<CommentViewModel> {
        const outputUserLogin: UserViewModel | null = await this.findUserForComment(userId)

        const newComment: CommentDBModel = {
            postId: postId,
            content: content,
            commentatorInfo: new CommentatorInfo(userId, outputUserLogin!.login),
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            }
        }

        return await feedBacksRepository.addNewComment(newComment)
    }
    async updateCommentById ( id: string, content: string ): Promise<boolean> {
        return feedBacksRepository.updateCommentById(id,
            content)
    }
    async deletedCountComment ( id: string ): Promise<boolean> {
        return await feedBacksRepository.deleteComment(id)
    }

}
