import type { CharacterCard } from "@tcg/lorcana-types";

export const queenOfHeartsLosingHerTemper: CharacterCard = {
  id: "123",
  cardType: "character",
  name: "Queen of Hearts",
  version: "Losing Her Temper",
  fullName: "Queen of Hearts - Losing Her Temper",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "ROYAL PAIN While this character has damage, she gets +3 {S}.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 122,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "88fa1eead948d44f2664e3321bf492777618b145",
  },
  abilities: [
    {
      id: "123-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
      text: "ROYAL PAIN While this character has damage, she gets +3 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
};
