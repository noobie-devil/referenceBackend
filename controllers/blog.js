import Blog from "../model/Blog.js";
import asyncHandler from "express-async-handler";
import {validateMongodbId} from "../utils/validateMongodbId.js";
import {cloudinaryUploadImg} from "../utils/cloudinary.js";

export const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(
            newBlog
        );
    } catch (e) {
        throw new Error(e);
    }
});

export const updateBlog = asyncHandler(async (req, res) => {
    const {id} = req?.params;
    try {
        const update = await Blog.findByIdAndUpdate(id, req?.body, {new: true});
        res.json(
            update
        );
    } catch (e) {
        throw new Error(e);
    }
});

export const getBlog = asyncHandler(async (req, res) => {
    const {id} = req?.params;
    validateMongodbId(id);
    try {
        const blog = await Blog.findById(id)
            .populate("likes")
            .populate("dislikes");
        await Blog.findByIdAndUpdate(
            id,
            {
                $inc: {viewCount: 1}
            },
            {
                new: true
            }
        );
        res.json(blog);
    } catch (e) {
        throw new Error(e);
    }
});

export const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (e) {
        throw new Error(e);
    }
});


export const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req?.params;
    validateMongodbId(id);
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);
    } catch (e) {
        throw new Error(e);
    }
});

export const likeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req?.body;
    validateMongodbId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {dislikes: loginUserId},
                isDisliked: false
            },
            {
                new: true
            }
        )
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {likes: loginUserId},
                isLiked: false,
            },
            {new: true}
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {likes: loginUserId},
                isLiked: true,
            },
            {new: true}
        );
        res.json(blog);
    }
});


export const dislikeBlog = asyncHandler(async (req, res) => {
    const {blogId} = req?.body;
    validateMongodbId(blogId);
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isDisliked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {likes: loginUserId},
                isLiked: false
            },
            {
                new: true
            }
        )
        res.json(blog);
    }
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {dislikes: loginUserId},
                isLiked: false
            },
            {new: true}
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {dislikes: loginUserId},
                isDisliked: true,
            },
            {new: true}
        );
        res.json(blog);
    }
});


export const uploadImages = asyncHandler(async (req, res) => {
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
        const findBlog = await Blog.findByIdAndUpdate(id, {
                images: urls.map(file => {
                    return file;
                })
            },
            {
                new: true
            });
        res.json(findBlog);
    } catch (e) {
        throw new Error(e);
    }
})


