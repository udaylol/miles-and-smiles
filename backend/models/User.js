import mongoose from "mongoose";
import { customAlphabet, urlAlphabet } from "nanoid";

const alphabet = urlAlphabet.replace(/[-_]/g, "");
const generateUsername = customAlphabet(alphabet, 6);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "/guest.png",
    },

    profilePicturePublicId: {
      type: String,
      default: null,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    incomingFriendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    outgoingFriendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    birthday: Date,

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

userSchema.pre("save", async function () {
  if (!this.username) {
    this.username = "User-" + generateUsername();
  }
});

const User = mongoose.model("User", userSchema);

export default User;