import type { CharacterCard } from "@tcg/lorcana-types";

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
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 88,
  inkable: true,
  externalIds: {
    ravensburger: "926bc29c21b56c27f1a52cfead290ea03de769de",
  },
  abilities: [
    {
      id: "14m-1",
      type: "keyword",
      keyword: "Ward",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
