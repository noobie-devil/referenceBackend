import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            select: false
        },
        sold: {
            type: Number,
            default: 0,
            select: false
        },
        images: [],
        color: {
            type: String,
            required: true
        },
        ratings: [{
            star: Number,
            comment: String,
            postedBy: {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        }],
        totalRating: {
            type: Number,
            default: 0
        }

    },
    {
        timestamps: true
    });

export default mongoose.model("Product", productSchema);
