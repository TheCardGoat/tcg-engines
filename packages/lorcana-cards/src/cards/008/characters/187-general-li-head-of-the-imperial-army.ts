import type { CharacterCard } from "@tcg/lorcana-types";

export const generalLiHeadOfTheImperialArmy: CharacterCard = {
  abilities: [
    {
      id: "iiq-1",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
  cardNumber: 187,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 3,
  externalIds: {
    ravensburger: "42bf6581e2f12f6875f38d3cbcd9a56544b2acfd",
  },
  franchise: "Mulan",
  fullName: "General Li - Head of the Imperial Army",
  id: "iiq",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "General Li",
  set: "008",
  strength: 2,
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  version: "Head of the Imperial Army",
  willpower: 4,
};
