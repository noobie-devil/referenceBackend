import mongoose from "mongoose";

const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product"
                },
                count: Number,
                color: String,
                price: Number
            }
        ],
        cartTotal: Number,
        totalAfterDiscount: Number,
        orderBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Cart", cartSchema);
