import type { ActionCard } from "@tcg/lorcana-types";

export const healingGlowundefined: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "ta0-1",
      text: "Remove up to 2 damage from chosen character.",
      type: "action",
    },
  ],
  cardNumber: 28,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Healing Glow - undefined",
  id: "ta0",
  inkType: ["amber"],
  inkable: true,
  name: "Healing Glow",
  set: "001",
  text: "Remove up to 2 damage from chosen character.",
  version: "undefined",
};
