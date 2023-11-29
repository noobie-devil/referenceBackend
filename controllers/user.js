import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import {generateToken} from "../config/jwtToken.js";
import {validateMongodbId} from "../utils/validateMongodbId.js";
import {generateRefreshToken} from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import {sendEmail} from "./email.js";
import * as crypto from "crypto";
import Cart from "../model/Cart.js";

export const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error(`User Already Exists`);
    }
});

export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const findUser = await User.findOne({email});
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            {new: true}
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        });
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

export const loginAdmin = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const findAdmin = await User.findOne({email});
    if (findAdmin.role !== "admin") throw new Error("Not Authorized");
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?.id);
        const updateUser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            {new: true}
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        });
        res.json({
            _id: findAdmin?._id,
            firstName: findAdmin?.firstName,
            lastName: findAdmin?.lastName,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

export const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user) {
        throw new Error("No refresh token present in db or not matched");
    }
    jwt.verify(refreshToken, process.env['JWT_SECRET'], (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?.id)
        res.json({accessToken});
    })
})

export const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (cookies.refreshToken) {
        const refreshToken = cookies.refreshToken;
        const user = await User.findOne({refreshToken});
        if (user) {
            await User.findOneAndUpdate(refreshToken, {
                refreshToken: ""
            });
        }
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    res.sendStatus(204);
})
export const getAllUser = asyncHandler(async (req, res, next) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (err) {
        throw new Error(err);
    }
});

export const getUserById = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const getUser = await User.findById(id);
        res.json({
            getUser
        });
    } catch (err) {
        throw new Error(err);
    }
});

export const updateUser = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    validateMongodbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                mobile: req?.body?.mobile
            },
            {
                new: true
            });
        res.json(updatedUser);
    } catch (err) {
        throw new Error(err);

    }
})

export const deleteUserById = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            deleteUser
        });
    } catch (err) {
        throw new Error(err);
    }
});

export const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, {
                isBlocked: true
            },
            {
                new: true
            });
        res.json({
            message: "User Blocked"
        });
    } catch (e) {
        throw new Error(e);
    }
});

export const unBlockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(id, {
                isBlocked: false
            },
            {
                new: true
            });
        res.json({
            message: "User UnBlocked"
        });
    } catch (e) {
        throw new Error(e);
    }
});

export const updatePassword = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {password} = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await User.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }

})


export const forgotPasswordToken = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) throw new Error('User not found with this email');
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetUrl
        };
        sendEmail(data);
        res.json(token);
    } catch (e) {
        throw new Error(e);
    }
});

export const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body;
    const token = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    if (!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});


export const getWishList = asyncHandler(async (req, res) => {
    const { _id } = req?.user;
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);
    } catch (e) {
        throw new Error(e);
    }
});

export const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req?.user;
    validateMongodbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address,
            },
            {
                new: true
            }
        );
        res.json(updatedUser);
    } catch (e) {
        throw new Error(e);
    }
})


export const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        let products = [];
        const user = await User.findById(_id);
        const alreadyExistCart = await Cart.findOne({orderBy: user._id});
        if(alreadyExistCart) {
            alreadyExistCart.remove();
        }

        for(let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select('price').exec();
            object.price = getPrice.price;
            product.push(object);
        }

        let cartTotal = 0;
        for(let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        console.log(products, cartTotal);
        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user?._id
        }).save();
        res.json(newCart);
    } catch (e) {
        throw new Error(e);
    }
});

export const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const cart = await Cart.findOne({ orderBy: _id }).populate("products.product");
        res.json(cart);
    } catch (e) {
        throw new Error(e);
    }
});

export const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderBy: user._id });
        res.json(cart);
    } catch (e) {
        throw new Error(e);
    }
});

export const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const validCoupon = await Coupon.findOne({ name: coupon });
    console.log(validCoupon);
    if(validCoupon === null) {
        throw new Error("Invalid coupon");
    }
    const user = await User.findOne({ _id });
    let {products, cartTotal} = await Cart.findOne({ orderBy: user._id })
        .populate("products.product");

});

