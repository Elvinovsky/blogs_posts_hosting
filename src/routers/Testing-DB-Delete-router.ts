import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/db/blogs-db-repository";
import {postsRepository} from "../repositories/db/posts-db-repository";

export const deleteAllDataRouter = Router();

deleteAllDataRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsRepository.testingDeleteAllBlogs()
    await postsRepository.testingDeleteAllPosts()
    res.send(204)
    return;
})