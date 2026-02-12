import type { ActionCard } from "@tcg/lorcana-types";

export const justInTime: ActionCard = {
  abilities: [
    {
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
      id: "1oy-1",
      text: "You may play a character with cost 5 or less for free.",
      type: "action",
    },
  ],
  cardNumber: 29,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "dbb279be140cfc1223bb35466a3781b83db4d5a8",
  },
  franchise: "Moana",
  id: "1oy",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Just in Time",
  set: "001",
  text: "You may play a character with cost 5 or less for free.",
};
