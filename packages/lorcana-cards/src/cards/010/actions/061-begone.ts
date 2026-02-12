import type { ActionCard } from "@tcg/lorcana-types";

export const begone: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "return-to-hand",
      },
      id: "q5p-1",
      text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
      type: "action",
    },
  ],
  cardNumber: 61,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "5e471c30152b4c4e8533f95c63bfdfd4dd5af197",
  },
  franchise: "Sword in the Stone",
  id: "q5p",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Begone!",
  set: "010",
  text: "Return chosen character, item, or location with cost 3 or less to their player's hand.",
};
