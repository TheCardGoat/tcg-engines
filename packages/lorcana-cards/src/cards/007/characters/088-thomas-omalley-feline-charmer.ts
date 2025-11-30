import type { CharacterCard } from "@tcg/lorcana";

export const thomasOmalleyFelineCharmer: CharacterCard = {
  id: "14m",
  cardType: "character",
  name: "Thomas O'Malley",
  version: "Feline Charmer",
  fullName: "Thomas O'Malley - Feline Charmer",
  inkType: ["emerald"],
  franchise: "Aristocats",
  set: "007",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cardNumber: "088",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "926bc29c21b56c27f1a52cfead290ea03de769de",
  },
  keywords: ["Ward"],
  abilities: [
    {
      id: "14m-1",
      text: "Ward",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
