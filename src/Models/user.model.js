import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true  //for optimisation during search.
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		fullname: {
			type: String,
			required: true,
			trim: true,
			index: true  //for optimisation during search.
		},
		avatar: {
			type: String,   //cloudinary url
			required: true
		},
		coverImage: {
			type: String,   //cloudinary url
		},
		watchHistory: {
			type: Schema.Types.ObjectId,
			ref: "Video"
		},
		password: {
			type: String,
			required: [true, 'Password is required']
		},
		refreshToken: {
			type: String
		}
	},
	{
		timeseries: true
	}
)

//don't use arrow function cause they don't have reference of "this".
//Use async cause hashing take time.
userSchema.pre("save", async function (next) {
	if (!this.isModified("password"))   //to check if password is changed or not.
		return next();

	this.password = await bcrypt.hash(this.password, 10)
	next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{    //payloads
			_id: this._id,
			email: this.email,
			usename: this.username,
			fullname: this.fullname
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY
		}
	)
}

userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{    //payloads
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY
		}
	)
}

export const User = mongoose.model("User", userSchema);