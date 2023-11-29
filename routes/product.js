import express from "express";
import {
    addToWishList,
    createProduct,
    deleteProduct,
    getAllProduct,
    getProductById, rating,
    updateProduct, uploadImages
} from "../controllers/product.js";
import {authMiddleware, isAdmin} from "../middlewares/authMiddleware";
import {productImgResize, uploadPhoto} from "../middlewares/uploadImages.js";


const productRouter = express.Router();

productRouter.get("/:id", getProductById);

productRouter.post("/", authMiddleware, createProduct);

productRouter.put("/upload/:id", authMiddleware, uploadPhoto.array('images', 10), productImgResize, uploadImages);

productRouter.put('/wishlist', authMiddleware, addToWishList);

productRouter.put('/rating', authMiddleware, rating);

productRouter.put("/:id", authMiddleware, isAdmin, updateProduct);

productRouter.delete("/:id", authMiddleware, isAdmin, deleteProduct);

productRouter.get("/", getAllProduct);


export default productRouter;
