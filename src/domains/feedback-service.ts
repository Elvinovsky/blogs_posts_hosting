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
import { likesInfoRepo } from "../repositories/db/likesInfo-db-repository";
import { ObjectId } from "mongodb";
import { LikeDBInfo } from "../models/modelsLike/like-input";
import { LikeModelClass } from "../models/mongoose/models";
import mongoose from "mongoose";

export class FeedbackService {
    async getComment ( id: string, userId?: string ): Promise<CommentViewModel | null> {
        return await feedBacksRepository.getCommentById(id,
            userId)
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
            commentatorInfo: new CommentatorInfo(userId,
                outputUserLogin!.login),
            createdAt: new Date().toISOString(),
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

    async createOrUpdateLike ( postOrCommentId: string, userId: string, userLogin: string, statusType: string ) {
       try {
            const isAlreadyLiked: LikeDBInfo | null = await likesInfoRepo.getLikeInfo(userId,
                postOrCommentId)

            //если пользователь не ставил ранне оценку коментарию или посту
            if (!isAlreadyLiked) {
                const newLikeInfo = await likesInfoRepo.addLikeInfo(userId,
                    userLogin,
                    postOrCommentId,
                    statusType)

                return newLikeInfo
            }

            // если отправленный статус совпадает с существующим в БД
            if (isAlreadyLiked.status === statusType) {
                return true
            }

            // если отправленный статус не совпадает с существующий статусом в БД
            const changeLikeInfo = await likesInfoRepo.updateLikeInfo(userId,
                postOrCommentId,
                statusType)

           return changeLikeInfo

        } catch (error) {
           console.log("FeedbackService.createOrUpdateLike", error)
           return false
       }
    }

    async likesInfoCurrentUser ( commentOrPostId: string | ObjectId, userId ?: string, ): Promise<string> {
        if (!userId) {
            return "None"
        }
        if (typeof commentOrPostId === "string") {
            const likeInfo: LikeDBInfo | null = await likesInfoRepo.getLikeInfo(userId,
                commentOrPostId)
            return likeInfo ? likeInfo.status : "None"
        }

        const likeInfo: LikeDBInfo | null = await likesInfoRepo.getLikeInfo(userId,
            commentOrPostId.toString())
        return likeInfo ? likeInfo.status : "None"
    }
}
