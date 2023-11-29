import express from "express";
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
import {
    createCategory,
    deleteCategory,
    getAllCategory,
    getCategory,
    updateCategory
} from "../controllers/productCategory.js";

const categoryRouter = express.Router();

categoryRouter.post('/', authMiddleware, isAdmin, createCategory);

categoryRouter.get('/', authMiddleware, isAdmin, getAllCategory);

categoryRouter.put('/:id', authMiddleware, isAdmin, updateCategory);

categoryRouter.delete('/:id', authMiddleware, isAdmin, deleteCategory);

categoryRouter.get('/:id', authMiddleware, isAdmin, getCategory);



export default categoryRouter;
