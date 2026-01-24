import type { ActionCard } from "@tcg/lorcana-types";

export const begone: ActionCard = {
  id: "q5p",
  cardType: "action",
  name: "Begone!",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "010",
  text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
  cost: 3,
  cardNumber: 61,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e471c30152b4c4e8533f95c63bfdfd4dd5af197",
  },
  abilities: [
    {
      id: "q5p-1",
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
    },
  ],
};
