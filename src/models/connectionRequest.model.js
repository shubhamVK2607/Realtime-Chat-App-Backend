import mongoose from "mongoose";
import User from "./user.model.js";

const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: User,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: User,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "${VALUE} is not from status type",
      },
      require: true,
    },
  },

  {
    timestamps: true,
  }
);

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

export default ConnectionRequest;
