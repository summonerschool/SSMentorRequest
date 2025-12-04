export const ranks = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTERS",
  "GRANDMASTERS",
  "CHALLENGER",
];

export const fullRanks = () => {
  const newRanks = [];
  ranks.map((rank, i) => {
    if (i < ranks.length - 3) {
      for (let i = 4; i > 0; i--) {
        newRanks.push(`${rank} ${i}`);
      }
    } else newRanks.push(rank);
  });
  return newRanks;
};

export const statuses = ["Not Accepted", "In-Progress", "Completed", "Problem"];

export const appStatuses = ["pending", "trial", "processed"];

export const regions = [
  "BR",
  "EUW",
  "EUNE",
  "NA",
  "LAN",
  "LAS",
  "OCE",
  "RU",
  "TR",
  "JP",
  "KR",
  "TW",
  "PH",
  "TH",
  "SG",
  "VN",
  "CN",
  "ME",
];

export const regionsCode = [
  "BR1",
  "EUW1",
  "EUN1",
  "NA1",
  "LA1",
  "LA2",
  "OC1",
  "RU",
  "TR1",
  "JP1",
  "KR",
  "TW2",
  "PH2",
  "TH2",
  "SG2",
  "VN2",
  "CN",
  "ME1",
];

export const userType = ["user", "mentor", "admin"];

export const userSelectCommand = (type) => `SET_${type.toUpperCase()}`;

export const roles = ["Top", "Jungle", "Mid", "ADC", "Support"];

export const champRoles = roles.map((role) => `All ${role} champions`);

export const rtHeader = [
  { title: "" },
  {
    title: "Created",
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  },
  {
    title: "Discord Username",
    sorter: (a, b) => `${a.discordName}`.localeCompare(b.discordName),
  },
  { title: "OP.GG" },

  {
    title: "Rank",
    sorter: (a, b) => ranks.indexOf(a.rank) - ranks.indexOf(b.rank),
  },
  {
    title: "Region",
    sorter: (a, b) => a.region.localeCompare(b.region),
  },
  {
    title: "Role",
    sorter: (a, b) => a.role.localeCompare(b.role),
  },
  { title: "Champions" },
  { title: "Timezone", sorter: (a, b) => a.timezone.localeCompare(b.timezone) },
  {
    title: "Status",
    sorter: (a, b) => statuses.indexOf(a.status) - statuses.indexOf(b.status),
  },
];

const mentorFormValues = [
  "What made you want to apply as a mentor?",
  "Describe the win conditions of your main champion, or any champion of your choosing. The more detail, the better!",
  "Choose what you believe to be the worst matchup for the champ you chose above, and describe how you would play that matchup. The more detail, the better!",
  "A user in an educational chat is adamant about a certain aspect to your champ, and you believe it is wrong. It could be the build, the playstyle, or something else. How do you go about explaining to them it is incorrect?",
  "Do you have mentoring or coaching experience? If so, please describe it. (Links to content you have produced are also acceptable)",
];

const mentorFormFields = [
  "appReason",
  "winConEx",
  "loseMatchupEx",
  "rebuttalEx",
  "experience",
];

export const trialAcceptText = `Thank you for your interest in being a mentor at Summoner School. We have reviewed your application and would like to move you forward in the process by giving you a trial period! To get started please say hi in <#${process.env.MENTOR_CHAT}> and read the pins in <#${process.env.IMPORTANT_MENTORCHAT}>.`;

export const trialDenyText = (
  reason
) => `Thank you for your interest in being a mentor in Summoner School. After reviewing your application we unfortunately have decided to decline at this time ${
  reason && "due to: " + reason
}. You may reapply in 3 months. 

If you plan on reapplying, we recommend being active in <#${
  process.env.VOD_REVIEW
}> or any of the other educational channels to practice mentoring.`;

export const mentorAcceptText = `Thank you for your participation with the mentoring team! As a result of your activity, we would like to officially add you as part of the Summoner School mentoring team! 
You can now head over to [the profile page](${process.env.WEBSITE}/mentors/profile) to update your profile on the mentoring website!

As for your next step, come to <#${process.env.MENTOR_CHAT}> and say hello! 
We also have a tradition that dates back to the beginning of time: it is of utmost importance that new mentors post: either a pic of their pet, a haiku or a pun (a good one)`;

export const mentorDenyText = (
  reason
) => `Thank you for you participation with the mentoring team. After reviewing your activity, we unfortunately have decided to decline at this time ${
  reason && "due to " + reason
}. If you would like, you can reapply after 3 months.

If you plan on reapplying, we recommend being active in <#${
  process.env.VOD_REVIEW
}> or any of the other educational channels to practice mentoring`;

export const mentorActivityReminderText = `Hello from the Summoner School team! We noticed that you have not been taking mentor requests lately and want to remind you to complete at least 1 VOD review per month from the mentor request sheet. You are able to bank up to 3 requests for the future if you anticipate being busy. This is also just a reminder that if you have any status changes (ex: will be inactive for a period, no longer wish to be a mentor, etc.) to please notify a Moderator.

  If you think you shouldn't have received this message, please contact Z in <#${process.env.MENTOR_CHAT}>`;

export const mentorFormQuestions = mentorFormValues.map((v, i) => ({
  field: mentorFormFields[i],
  title: v,
}));
