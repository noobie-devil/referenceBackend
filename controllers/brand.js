import Brand from "../model/Brand.js";
import asyncHandler from "express-async-handler";
import {validateMongodbId} from "../utils/validateMongodbId.js";

export const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (err) {
        throw new Error(err);
    }
});

export const updateBrand = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateBrand);
    } catch (err) {
        throw new Error(err);
    }
});

export const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json(deletedBrand);
    } catch(err) {
        throw new Error(err);
    }
});

export const getBrand = asyncHandler(async (req, res) => {
    const { id } = req?.params;
    validateMongodbId(id);
    try {
        const getBrand = await Brand.findById(id);
        res.json(getBrand);
    } catch (e) {
        throw new Error(e);
    }
});

export const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const getAllBrand = await Brand.find();
        res.json(getAllBrand);
    } catch (e) {
        throw new Error(e);
    }
});

