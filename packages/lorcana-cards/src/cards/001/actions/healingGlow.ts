import type { ActionCard } from "@tcg/lorcana-types";

export const healingGlowundefined: ActionCard = {
  id: "ta0",
  cardType: "action",
  name: "Healing Glow",
  version: "undefined",
  fullName: "Healing Glow - undefined",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "Remove up to 2 damage from chosen character.",
  cost: 1,
  cardNumber: 28,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "ta0-1",
      text: "Remove up to 2 damage from chosen character.",
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
};
