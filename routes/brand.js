import express from "express";
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
import {createBrand, deleteBrand, getAllBrand, getBrand, updateBrand} from "../controllers/brand.js";

const brandRouter = express.Router();


brandRouter.post('/', authMiddleware, isAdmin, createBrand);

brandRouter.get('/', authMiddleware, isAdmin, getAllBrand);

brandRouter.put('/:id', authMiddleware, isAdmin, updateBrand);

brandRouter.delete('/:id', authMiddleware, isAdmin, deleteBrand);

brandRouter.get('/:id', authMiddleware, isAdmin, getBrand);


export default brandRouter;
