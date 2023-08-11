export const ranks = [
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Masters",
  "Grandmasters",
  "Challenger",
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
  "VN",
  "CN",
  "Garena",
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

export const trialAcceptText = `Thank you for your interest in being a mentor at Summoner School. We have reviewed your application and would like to move you forward in the process by giving you a trial period! To get started please say hi in #mentor-chat and read the pins in #important-chat.`;

export const mentorFormQuestions = mentorFormValues.map((v, i) => ({
  field: mentorFormFields[i],
  title: v,
}));
