import type { ActionCard } from "@tcg/lorcana-types";

export const zeroToHero: ActionCard = {
  id: "1qz",
  cardType: "action",
  name: "Zero to Hero",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "002",
  text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 32,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e304dbf3757b9b3aee99fb65f9752724aac895c5",
  },
  abilities: [],
};
