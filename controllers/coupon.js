import Coupon from "../model/Coupon.js";
import asyncHandler from "express-async-handler";
import {validateMongodbId} from "../utils/validateMongodbId.js";

export const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (e) {
        throw new Error(e);
    }
});

export const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (e) {
        throw new Error(e);
    }
});

export const updateCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const coupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true});
        res.json(coupon);
    } catch (e) {
        throw new Error(e);
    }
});

export const deleteCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const coupon = await Coupon.findByIdAndDelete(id);
    } catch (e) {
        throw new Error(e);
    }
})
