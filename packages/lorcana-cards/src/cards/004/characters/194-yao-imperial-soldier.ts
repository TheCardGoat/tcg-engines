import type { CharacterCard } from "@tcg/lorcana";

export const yaoImperialSoldier: CharacterCard = {
  id: "ayj",
  cardType: "character",
  name: "Yao",
  version: "Imperial Soldier",
  fullName: "Yao - Imperial Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "Challenger +2 (While challenging, this character gets +2.)",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 194,
  inkable: true,
  externalIds: {
    ravensburger: "277f711b5cc9107e8bae7d0ab1d79e8e08ca13f3",
  },
  keywords: [
    {
      type: "Challenger",
      value: 2,
    },
  ],
  abilities: [
    {
      id: "ayj-1",
      text: "Challenger +2",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
