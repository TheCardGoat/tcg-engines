import type { CharacterCard } from "@tcg/lorcana-types";

export const yaoImperialSoldier: CharacterCard = {
  abilities: [
    {
      id: "ayj-1",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
  ],
  cardNumber: 194,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "277f711b5cc9107e8bae7d0ab1d79e8e08ca13f3",
  },
  franchise: "Mulan",
  fullName: "Yao - Imperial Soldier",
  id: "ayj",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Yao",
  set: "004",
  strength: 2,
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)",
  version: "Imperial Soldier",
  willpower: 5,
};
