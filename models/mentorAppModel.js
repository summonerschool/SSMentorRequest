import mongoose from "mongoose";
import { appStatuses, regions, roles } from "../util/datalist";

const MentorAppSchema = mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
    },
    discordName: {
      type: String,
      required: true,
    },
    summonerName: {
      type: String,
    },
    region: {
      type: String,
      enum: regions,
    },
    rank: {
      type: String,
      default: "Iron 4",
    },
    appReason: {
      type: String,
    },
    winConEx: {
      type: String,
    },
    loseMatchupEx: {
      type: String,
    },
    rebuttalEx: {
      type: String,
    },
    experience: {
      type: String,
    },
    yay: {
      type: [String],
      default: [],
    },
    nay: {
      type: [String],
      default: [],
    },
    meh: {
      type: [String],
      default: [],
    },
    appStatus: {
      type: String,
      enum: appStatuses,
      default: "pending",
    },
    userLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        commenter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
    primaryRole: {
      type: String,
      enum: roles,
      required: true,
    },
    secondaryRole: {
      type: String,
      enum: roles,
      required: true,
    },
    dateTrialStarted: {
      type: Date,
    },
    dateTrialEnded: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.MentorApp ||
  mongoose.model("MentorApp", MentorAppSchema);
