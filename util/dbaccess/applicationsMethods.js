import dayjs from "dayjs";
import MentorApp from "../../models/mentorAppModel";
import Request from "../../models/requestModel";
import Users from "../../models/userModel";
import {
  mentorAcceptText,
  mentorDenyText,
  trialAcceptText,
  trialDenyText,
} from "../datalist";
import dbConnect from "../mongodb";
import { sendDMToUser } from "./discordMethods";
import { getUserById, getUsersById, tryRegisterMentor } from "./userMethods";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
dbConnect();

export async function checkAppStatus(id) {
  const application = checkPendingApp(id);
  const mentor = await Users.findOne({ discordId: id });
  if (mentor?.isMentor) return "accepted";
  else return (await application).appStatus;
}

export async function checkPendingApp(id) {
  return MentorApp.findOne({
    discordId: id,
    dateTrialEnded: { $exists: true, $gte: dayjs().subtract(3, "month") },
  });
}

export async function createApp(user, details) {
  const app = new MentorApp({
    ...details,
    discordId: user.sub,
    discordName: `${user.name}#${user.discriminator}`,
  });

  return await app.save();
}

export async function getAllApps(processed) {
  const query = processed !== undefined ? { processed } : {};
  const apps = await MentorApp.find(query)
    .select(" -updatedAt -__v")
    .populate("userLink comments.commenter")
    .lean();
  //This should be simpler, but at least it works atm
  const newApps = await Promise.all(
    apps.map(async (app) => {
      if (app.appStatus != "trial") {
        app.requestCount = await Request.countDocuments({
          mentor: app.userLink,
        });
      }
      return {
        ...app,
        voted: await getUsersById(app.yay.concat(app.nay.concat(app.meh))),
      };
    })
  );

  return newApps;
}

export async function voteOnApp({ id, vote, reviewer }) {
  const app = await MentorApp.findOne({ discordId: id });

  app.yay = app.yay.filter((id) => id != reviewer);
  app.nay = app.nay.filter((id) => id != reviewer);
  app.meh = app.meh.filter((id) => id != reviewer);
  app[vote].push(reviewer);
  await app.save();
}

export async function deleteApp(id) {
  const response = await MentorApp.findByIdAndRemove(id);
  console.log(response);
}

export async function processApp({ discordId, command, denyReason }) {
  const accepted = command == "ACCEPT";
  const app = await MentorApp.findOne({ discordId });
  let message;
  switch (app.appStatus) {
    case "pending": {
      if (accepted) {
        const mentor = await tryRegisterMentor(app);
        app.userLink = mentor._id;
        app.dateTrialStarted = new Date();
        app.appStatus = "trial";
        message = trialAcceptText;
        app.yay = [];
        app.nay = [];
        app.meh = [];
      } else {
        app.appStatus = "processed";
        message = trialDenyText(denyReason);
      }
      break;
    }
    case "trial": {
      const mentor = await Users.findOne({ discordId: app.discordId });
      mentor.isTrial = false;
      mentor.isMentor = accepted;
      mentor.save();
      app.appStatus = "processed";
      app.dateTrialEnded = new Date();
      message = accepted ? mentorAcceptText : mentorDenyText(denyReason);
      break;
    }
    case "processed":
      if (process.env.ENV == "dev") app.appStatus = "pending";
      break;
  }
  app.save();
  sendDMToUser(discordId, message);
}

export async function commentApp({ commenterId, user, content }) {
  const app = await MentorApp.findOne({ discordId: user });
  const commenter = await getUserById(commenterId);
  app.comments.push({ commenter: commenter._id, content });
  await app.save();
}
