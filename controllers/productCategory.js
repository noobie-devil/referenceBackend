import Category from "../model/ProductCategory.js";
import asyncHandler from "express-async-handler";
import {validateMongodbId} from "../utils/validateMongodbId.js";

export const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (err) {
        throw new Error(err);
    }
});

export const updateCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateCategory);
    } catch (err) {
        throw new Error(err);
    }
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch(err) {
        throw new Error(err);
    }
});

export const getCategory = asyncHandler(async (req, res) => {
    const { id } = req?.params;
    validateMongodbId(id);
    try {
        const getCategory = await Category.findById(id);
        res.json(getCategory);
    } catch (e) {
        throw new Error(e);
    }
});

export const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const getAllCategory = await Category.find();
        res.json(getAllCategory);
    } catch (e) {
        throw new Error(e);
    }
});

