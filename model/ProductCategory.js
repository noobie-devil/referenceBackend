import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema(
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

export default mongoose.model("Category", categorySchema);

