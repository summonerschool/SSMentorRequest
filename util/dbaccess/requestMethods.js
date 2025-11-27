import mongoose from "mongoose";
import Request from "../../models/requestModel";
import dbConnect from "../mongodb";
import { getCleanedDiscordUser, getMonthsAgo } from "../helper";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
mongoose.set("strictQuery", false);
dbConnect();

const getRequests = async (fields) => {
  const requests = await Request.find(fields)
    .select(
      "_id discordName summonerName createdAt rank role champions timezone status accepted region"
    )
    .sort({ createdAt: 1 })
    .lean();
  return requests;
};

export async function getAllRequests() {
  const threeMonthsAgo = getMonthsAgo(3);
  const requests = await getRequests({
    archived: { $ne: true },
    createdAt: { $gte: dayjs(process.env.REOPEN) },
    $or: [
      {
        $and: [
          { status: { $in: ["Completed", "Problem"] } },
          {
            completed: { $gte: threeMonthsAgo },
          },
        ],
      },
      {
        $and: [{ status: { $nin: ["Completed", "Problem"] } }],
      },
    ],
  });

  return requests;
}

export const getRequestDetails = async (id) => {
  const detail = await Request.findById(id)
    .populate({
      path: "mentor",
      model: "User",
      select: "discordName discordId",
    })
    .populate({
      path: "comments.commenter",
      model: "User",
      select: "discordName discordId",
    })
    .populate({
      path: "interactedMentors.mentor",
      model: "User",
      select: "discordName discordId",
    });

  return detail;
};

export async function getTypeRequests(status) {
  return await getRequests({ status });
}

export const getStudentRequestsByDiscordId = async (id) => {
  return await getRequests({ discordId: id });
};

export async function getMentorRequests(_id) {
  //TODO: verify if this route needs cleanup
  return await getRequests({
    mentor: ObjectId(_id),
  });
}

export async function deleteRequest(id) {
  const state = await Request.findByIdAndDelete(id);
  console.log(state);
}

export async function createRequest({ values, user }) {
  const pending = await isRequestPending(user.sub);

  if (pending) throw Error;

  const request = new Request({
    ...values,
    discordName: getCleanedDiscordUser(user),
    discordId: user.sub,
  });

  return await request.save();
}

export async function isRequestPending(id) {
  const request = await Request.findOne({
    discordId: id,
    archived: false,
    $or: [
      { completed: { $exists: false } },
      {
        $and: [
          { completed: { $gte: dayjs().subtract(1, "month") } },
          { status: "Completed" },
        ],
      },
      {
        $and: [
          { completed: { $gte: dayjs().subtract(3, "month") } },
          { status: "Problem" },
        ],
      },
    ],
  }).sort({ createdAt: -1 });

  return request.status;
}

export async function changeRequest({ body, user }) {
  const now = new Date();
  const request = await Request.findById(body.id);

  if (!request) {
    throw { error: "I uh... what?" };
  }

  let action = body.type;

  switch (body.type) {
    case "status":
      request.mentor = user._id;
      request.status = body.value;
      action = body.value;

      switch (body.value) {
        case "In-Progress":
          request.accepted = now;
          break;
        case "Not Accepted":
          request.accepted = null;
          request.completed = null;
          break;
        case "Completed":
        case "Problem":
          if (!request.accepted) {
            request.accepted = now;
          }
          request.completed = now;
          break;
      }
      break;
    case "archive":
      request.archived = !request.archived;
      break;
  }

  request.interactedMentors.push({
    mentor: user._id,
    action,
    date: new Date(),
  });
  await request.save();
}

export const addRequestComment = async ({
  commenterId,
  requestId,
  content,
}) => {
  const request = await Request.findById(requestId);
  request.comments.push({ commenter: commenterId, content });
  await request.save();
};
