import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import {query} from "express";
import User from "../model/User.js";
import {validateMongodbId} from "../utils/validateMongodbId.js";
import {cloudinaryUploadImg} from "../utils/cloudinary.js";

export const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req?.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});


export const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req?.params;
    try {
        if (req?.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const update = await Product.findByIdAndUpdate(id, req?.body, {new: true});
        res.json(update);
    } catch (e) {
        throw new Error(e);
    }
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req?.params;
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch (e) {
        throw new Error(e);
    }
});

export const getProductById = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (err) {
        throw new Error(err);
    }
});

export const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(value => delete queryObj[value]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        if (req?.query.sort) {
            const sortBy = req.query.sort.split(", ").join(" ");
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createdAt");
        }

        if (req?.query.fields) {
            const fields = req.query.fields.split(", ").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        const page = req?.query.page;
        const limit = req?.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req?.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page not exists");
        }

        const products = await query;

        res.json(products);
    } catch (error) {
        throw new Error(error);
    }
});

export const addToWishList = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {productId} = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyExists = user.wishList.find((id) => id.toString() === productId);
        if (alreadyExists) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: {wishList: productId}
            }, {
                new: true
            });
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: {wishList: productId}
            }, {
                new: true
            });
            res.json(user);
        }
    } catch (err) {
        throw new Error(err);
    }
});

export const rating = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {star, productId, comment} = req.body;
    try {
        const product = await Product.findById(productId);
        let alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString());
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated}
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment": comment}
                },
                {
                    new: true
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(productId, {
                $push: {
                    ratings: {
                        star: star,
                        postedBy: _id,
                        comment: comment
                    }
                }
            }, {
                new: true
            });

        }
        const getAllRatings = await Product.findById(productId);
        const totalRating = getAllRatings.ratings.length;
        let ratingSum = getAllRatings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingSum / totalRating);

        let finalProduct = await Product.findByIdAndUpdate(productId, {
            totalRating: actualRating,
        }, {
            new: true
        })
        res.json(finalProduct);

    } catch (err) {
        throw new Error(err);
    }

});

export const uploadImages = asyncHandler(async (req, res) => {
    console.log(req.files);
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req?.files;
        for (const file of files) {
            const {path} = file;
            const newPath = await uploader(path);
            urls.push(newPath);
        }
        const findProduct = await Product.findByIdAndUpdate(id, {
                images: urls.map(file => {
                    return file;
                })
            },
            {
                new: true
            });
        res.json(findProduct);
    } catch (e) {
        throw new Error(e);
    }
})
