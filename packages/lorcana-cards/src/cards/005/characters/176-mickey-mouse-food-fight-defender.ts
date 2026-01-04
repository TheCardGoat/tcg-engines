import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseFoodFightDefender: CharacterCard = {
  id: "1m7",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Food Fight Defender",
  fullName: "Mickey Mouse - Food Fight Defender",
  inkType: ["steel"],
  set: "005",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 176,
  inkable: true,
  externalIds: {
    ravensburger: "d1324726fcfc8dc6a6c64e536b9abff579e86482",
  },
  abilities: [
    {
      id: "1m7-1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
