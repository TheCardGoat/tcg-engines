import type { CharacterCard } from "@tcg/lorcana-types";

export const kenaiBigBrother: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      id: "a82-1",
      text: "BROTHERS FOREVER While this character is exerted, your characters named Koda can't be challenged.",
      type: "static",
    },
  ],
  cardNumber: 5,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "24d95c1e01ef2ed85eb6d9a0623f71835ef9e722",
  },
  franchise: "Brother Bear",
  fullName: "Kenai - Big Brother",
  id: "a82",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Kenai",
  set: "005",
  strength: 1,
  text: "BROTHERS FOREVER While this character is exerted, your characters named Koda can't be challenged.",
  version: "Big Brother",
  willpower: 4,
};
