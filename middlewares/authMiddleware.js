import User from "../model/User.js";
import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')) {
        token = req?.headers.authorization.split(" ")[1];
        try {
            if(token) {
                const decoded = jwt.verify(token, process.env['JWT_SECRET']);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (err) {
            throw new Error('Token expired. Please login again');
        }
    } else {
        throw new Error("Unauthorized");
    }
});

export const isAdmin = asyncHandler(async (req,res) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if(adminUser.role !== "admin") {
        throw new Error('You are not admin');
    } else {
        next();
    }
})


