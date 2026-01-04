import type { ActionCard } from "@tcg/lorcana-types";

export const justInTimeundefined: ActionCard = {
  id: "gir",
  cardType: "action",
  name: "Just in Time",
  version: "undefined",
  fullName: "Just in Time - undefined",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "You may play a character with cost 5 or less for free.",
  cost: 3,
  cardNumber: 29,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "You may play a character with cost 5 or less for free.",
      id: "gir-1",
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
    },
  ],
};
