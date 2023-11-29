import express from "express";
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
import {
    createBlog,
    deleteBlog,
    dislikeBlog,
    getAllBlogs,
    getBlog,
    likeBlog,
    updateBlog,
    uploadImages
} from "../controllers/blog.js";
import {blogImgResize, uploadPhoto} from "../middlewares/uploadImages.js";

const blogRouter = express.Router();

blogRouter.post('/', authMiddleware, isAdmin, createBlog);

blogRouter.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 2), blogImgResize, uploadImages)

blogRouter.put('/likes', authMiddleware, likeBlog);

blogRouter.put('/dislikes', authMiddleware, dislikeBlog);

blogRouter.put('/:id', authMiddleware, isAdmin, updateBlog);

blogRouter.get('/:id', getBlog);

blogRouter.get('/:id', getAllBlogs);

blogRouter.delete('/:id', authMiddleware, isAdmin, deleteBlog);


export default blogRouter;
