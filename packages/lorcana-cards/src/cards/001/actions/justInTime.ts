import type { ActionCard } from "@tcg/lorcana-types";

export const justInTimeundefined: ActionCard = {
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
      id: "gir-1",
      text: "You may play a character with cost 5 or less for free.",
      type: "action",
    },
  ],
  cardNumber: 29,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Just in Time - undefined",
  id: "gir",
  inkType: ["amber"],
  inkable: true,
  name: "Just in Time",
  set: "001",
  text: "You may play a character with cost 5 or less for free.",
  version: "undefined",
};
