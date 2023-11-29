import express from "express";
import {createCoupon, deleteCoupon, getAllCoupon, updateCoupon} from "../controllers/coupon.js";
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";

const couponRouter = express.Router();

couponRouter.post('/', authMiddleware, isAdmin, createCoupon);

couponRouter.get('/', authMiddleware, isAdmin, getAllCoupon);

couponRouter.put('/:id', authMiddleware, isAdmin, updateCoupon);

couponRouter.delete('/:id', authMiddleware, isAdmin, deleteCoupon);

export default couponRouter;
