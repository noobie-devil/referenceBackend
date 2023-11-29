import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import * as crypto from "crypto";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: String
    },
    wishList: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// userSchema.method('createPasswordResetToken', async function () {
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest("hex");
//     this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
//     return resetToken;
// });

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resetToken;
};
export default mongoose.model("User", userSchema);

