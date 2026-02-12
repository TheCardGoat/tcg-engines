import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsLosingHerTemper: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
      id: "123-1",
      text: "ROYAL PAIN While this character has damage, she gets +3 {S}.",
      type: "static",
    },
  ],
  cardNumber: 122,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Queen"],
  cost: 2,
  externalIds: {
    ravensburger: "88fa1eead948d44f2664e3321bf492777618b145",
  },
  franchise: "Alice in Wonderland",
  fullName: "Queen of Hearts - Losing Her Temper",
  id: "123",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Queen of Hearts",
  set: "007",
  strength: 1,
  text: "ROYAL PAIN While this character has damage, she gets +3 {S}.",
  version: "Losing Her Temper",
  willpower: 4,
};
