import type { CharacterCard } from "@tcg/lorcana";

export const helgaSinclairRighthandWoman: CharacterCard = {
  id: "1fd",
  cardType: "character",
  name: "Helga Sinclair",
  version: "Right-Hand Woman",
  fullName: "Helga Sinclair - Right-Hand Woman",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "003",
  text: "Challenger +2 (While challenging, this character gets +2.)",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 175,
  inkable: true,
  externalIds: {
    ravensburger: "b92c30c1e0b46b38207f9ff73b6e43a9d4ffd5c9",
  },
  keywords: [
    {
      type: "Challenger",
      value: 2,
    },
  ],
  abilities: [
    {
      id: "1fd-1",
      text: "Challenger +2",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
