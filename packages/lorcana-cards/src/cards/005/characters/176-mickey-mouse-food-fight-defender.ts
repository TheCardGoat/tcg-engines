import type { CharacterCard } from "@tcg/lorcana";

export const mickeyMouseFoodFightDefender: CharacterCard = {
  id: "1m6",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Food Fight Defender",
  fullName: "Mickey Mouse - Food Fight Defender",
  inkType: ["steel"],
  set: "005",
  text: "Resist +1 (Damage dealt to this character is reduced by 1.)",
  cardNumber: "176",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "d1324726fcfc8dc6a6c64e536b9abff579e86482",
  },
  keywords: [
    {
      type: "Resist",
      value: 1,
    },
  ],
  abilities: [
    {
      id: "1m6a1",
      text: "Resist +1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
