import type { ActionCard } from "@tcg/lorcana-types";

export const zeroToHero: ActionCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1qz-1",
      text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 32,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "e304dbf3757b9b3aee99fb65f9752724aac895c5",
  },
  franchise: "Hercules",
  id: "1qz",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Zero to Hero",
  set: "002",
  text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
};
