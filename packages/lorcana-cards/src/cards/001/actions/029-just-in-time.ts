import type { ActionCard } from "@tcg/lorcana-types";

export const justInTime: ActionCard = {
  id: "1oy",
  cardType: "action",
  name: "Just in Time",
  inkType: ["amber"],
  franchise: "Moana",
  set: "001",
  text: "You may play a character with cost 5 or less for free.",
  cost: 3,
  cardNumber: 29,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "dbb279be140cfc1223bb35466a3781b83db4d5a8",
  },
  abilities: [
    {
      id: "1oy-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 5,
          },
        },
        chooser: "CONTROLLER",
      },
      text: "You may play a character with cost 5 or less for free.",
    },
  ],
};
