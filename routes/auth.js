import express from "express";
import {
    applyCoupon,
    blockUser,
    createUser,
    deleteUserById, emptyCart, forgotPasswordToken,
    getAllUser,
    getUserById, getUserCart, getWishList, handleRefreshToken,
    login, loginAdmin, logout, resetPassword, saveAddress, unBlockUser, updatePassword,
    updateUser, userCart
} from "../controllers/user.js";
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.get('/all-users', getAllUser);
authRouter.get('/:id', authMiddleware, getUserById);
authRouter.get("/cart", authMiddleware, getUserCart);
authRouter.get("/wishlist", authMiddleware, getWishList);

authRouter.post("/register", createUser);
authRouter.post("/login", login);
authRouter.post("/admin-login", loginAdmin);
authRouter.post('/forgot-password-token', forgotPasswordToken);
authRouter.post("/refresh-token", handleRefreshToken);
authRouter.post("/logout", logout);
authRouter.post("/cart", authMiddleware, userCart);
authRouter.post("/cart/applyCoupon", authMiddleware, applyCoupon);

authRouter.put("/password", authMiddleware, updatePassword);
authRouter.put('/reset-password/:token', resetPassword);
authRouter.put('/edit-user', authMiddleware, updateUser);
authRouter.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
authRouter.put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser);
authRouter.put("/save-address", authMiddleware, saveAddress);

authRouter.delete('/:id', deleteUserById);
authRouter.delete("/empty-cart", authMiddleware, emptyCart);

export default authRouter;
