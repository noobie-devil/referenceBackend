import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const brandSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Brand", brandSchema);

