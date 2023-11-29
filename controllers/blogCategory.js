import BlogCategory from "../model/BlogCategory.js";
import asyncHandler from "express-async-handler";
import {validateMongodbId} from "../utils/validateMongodbId.js";

export const createBlogCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await BlogCategory.create(req.body);
        res.json(newCategory);
    } catch (err) {
        throw new Error(err);
    }
});

export const updateBlogCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const updateCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateCategory);
    } catch (err) {
        throw new Error(err);
    }
});

export const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedCategory = await BlogCategory.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch(err) {
        throw new Error(err);
    }
});

export const getBlogCategory = asyncHandler(async (req, res) => {
    const { id } = req?.params;
    validateMongodbId(id);
    try {
        const getCategory = await BlogCategory.findById(id);
        res.json(getCategory);
    } catch (e) {
        throw new Error(e);
    }
});

export const getAllBlogCategory = asyncHandler(async (req, res) => {
    try {
        const getAllCategory = await BlogCategory.find();
        res.json(getAllCategory);
    } catch (e) {
        throw new Error(e);
    }
});

