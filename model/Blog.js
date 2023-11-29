import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true
        },
        viewCount: {
            type: Number,
            default: 0
        },
        isLiked: {
            type: Boolean,
            default: false
        },
        isDisliked: {
            type: Boolean,
            default: false
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        dislikes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        image: {
            type: String,
            default: "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg?s=612x612&w=0&k=20&c=xR2vOmtg-N6Lo6_I269SoM5PXEVRxlgvKxXUBMeMC_A="
        },
        author: {
            type: String,
            default: "Admin"
        },
        images: [],
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export default mongoose.model("Blog", blogSchema);

