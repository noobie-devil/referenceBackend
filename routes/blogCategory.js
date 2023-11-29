import express from "express";
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware";
import {
    createBlogCategory,
    deleteBlogCategory,
    getAllBlogCategory, getBlogCategory,
    updateBlogCategory
} from "../controllers/blogCategory.js";


const blogCategoryRouter = express.Router();

blogCategoryRouter.post('/', authMiddleware, isAdmin, createBlogCategory);

blogCategoryRouter.get('/', authMiddleware, isAdmin, getAllBlogCategory);

blogCategoryRouter.put('/:id', authMiddleware, isAdmin, updateBlogCategory);

blogCategoryRouter.delete('/:id', authMiddleware, isAdmin, deleteBlogCategory);

blogCategoryRouter.get('/:id', authMiddleware, isAdmin, getBlogCategory);
export default blogCategoryRouter;
