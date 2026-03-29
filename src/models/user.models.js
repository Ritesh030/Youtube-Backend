import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { ACCESS_TOKEN_SECRET } from "../constants.js"
import { ACCESS_TOKEN_EXPIRY } from "../constants.js"
import { REFRESH_TOKEN_SECRET } from "../constants.js"
import { REFRESH_TOKEN_EXPIRY } from "../constants.js"
import { type } from "os";

const userSchema = new Schema(
      {
            username: {
                  type: String,
                  required: true,
                  lowercase: true,
                  unique: true,
                  trim: true,
                  index: true
            },
            email: {
                  type: String,
                  required: true,
                  lowercase: true,
                  unique: true,
                  trim: true
            },
            fullName: {
                  type: String,
                  required: true,
                  trim: true,
                  index: true
            },
            avatar: {
                  url: {
                        type: String,
                        required: true
                  },
                  publicId: {
                        type: String,
                        required: true
                  }
            },
            coverImage: {
                  url: {
                        type: String
                  },
                  publicId: {
                        type: String
                  }
            },
            watchHistory: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: "Video"
                  }
            ],
            password: {
                  type: String,
                  required: [true, "Password is required"]
            },
            refreshToken: {
                  type: String
            },
            usernameLastChangedAt: {
                  type: Date,
                  default: null
            }
      }, { timestamps: true }
)


// Run this middleware BEFORE saving a user document to the database
// we cannot use arrow function here because arrow fuction does not have reference to (this) keyword
userSchema.pre("save", async function () {

    // Only hash the password if it was created or changed
    // This prevents re-hashing an already-hashed password on every save like email, username, etc.. updates
    if (this.isModified("password")) {
        // Hash the plain-text password using bcrypt
        // 10 is the salt rounds (cost factor)
        // Higher = more secure but slower
        this.password = await bcrypt.hash(this.password, 10); //// Wait for the async operation to finish before using its result
    }
});

// inject new method for cheking the password
userSchema.methods.isPasswordCorrect = async function (password) {
      return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function () {
      return jwt.sign(
            {
                  _id: this._id,
                  email: this.email,
                  username: this.username,
                  fullName: this.fullName
            },
            ACCESS_TOKEN_SECRET,
            {
                  expiresIn: ACCESS_TOKEN_EXPIRY,
                  // algorithm: "HS512"
                  // header: {
                  //       typ: "JWT",
                  //       kid: "auth-key-1"
                  // }
            }
      )
}

// token -- header+payload(data and created and exprireIn)+signature

// signature = HMAC_SHA256(
//    base64(header) + "." + base64(payload),
//    secret_key
// )

userSchema.methods.generateRefreshToken = function () {
      return jwt.sign(
            {
                  _id: this._id
            },
            REFRESH_TOKEN_SECRET,
            {
                  expiresIn: REFRESH_TOKEN_EXPIRY
            }
      )
}

export const User = mongoose.model("User", userSchema)