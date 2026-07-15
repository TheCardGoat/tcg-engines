import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseFoodFightDefender: CharacterCard = {
  abilities: [
    {
      id: "1m7-1",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
  cardNumber: 176,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 1,
  externalIds: {
    ravensburger: "d1324726fcfc8dc6a6c64e536b9abff579e86482",
  },
  fullName: "Mickey Mouse - Food Fight Defender",
  id: "1m7",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Mickey Mouse",
  set: "005",
  strength: 1,
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  version: "Food Fight Defender",
  willpower: 2,
};
