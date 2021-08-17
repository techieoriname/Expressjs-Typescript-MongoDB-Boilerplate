import {Document, HookNextFunction, model, Schema} from "mongoose";
import bcrypt from "bcrypt";


export interface UserDocument extends Document {
    email: string;
    name: string;
    password: string;
    loginToken: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        loginToken: { type: String }
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next: HookNextFunction) {
    let user = this as UserDocument;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // Random additional data
    const salt = await bcrypt.genSalt(10);

    // Replace the password with the hash
    user.password = bcrypt.hashSync(user.password, salt);

    return next();
});

const User = model<UserDocument>("User", UserSchema);

export default User;
