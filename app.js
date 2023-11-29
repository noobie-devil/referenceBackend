import express from 'express';
import mongoose from 'mongoose';
import dbConnect from "./config/dbConnect.js";
import router from "./routes/user-routes.js";
import authRouter from "./routes/auth";
import productRouter from "./routes/product.js";
import { config } from 'dotenv';
import bodyParser from "body-parser";
import {errorHandler, notFound} from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import blogRouter from "./routes/blog.js";
import categoryRouter from "./routes/productCategory.js";
import blogCategoryRouter from "./routes/blogCategory.js";
import brandRouter from "./routes/brand.js";
import couponRouter from "./routes/coupon.js";

config()

const PORT = process.env['PORT'];
const app = express();

app
    .use(morgan("dev"))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false}))
    .use(cookieParser())
    .use("/api/user", authRouter)
    .use("/api/products", productRouter)
    .use("/api/blog", blogRouter)
    .use("/api/category", categoryRouter)
    .use("/api/blog-category", blogCategoryRouter)
    .use("/api/brand", brandRouter)
    .use("/api/coupon", couponRouter)
    .use(notFound)
    .use(errorHandler);

dbConnect().then(() => {
    app.listen(PORT, () => console.log(`Server port: ${PORT}`));
}).catch(err => console.log(`${err} did not connect`));

// mongoose.connect(
//     'mongodb+srv://admin:hGC4uf7fv7Gb8Glw@cluster0.cjub8my.mongodb.net/Blog?retryWrites=true&w=majority'
// )
//     .then(() => app.listen(5000))
//     .then(() => console.log("Connected"))
//     .catch((err) => console.log(err));
