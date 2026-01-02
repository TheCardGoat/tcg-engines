import type { CharacterCard } from "@tcg/lorcana-types";

export const scarTempestuousLion: CharacterCard = {
  id: "ug5",
  cardType: "character",
  name: "Scar",
  version: "Tempestuous Lion",
  fullName: "Scar - Tempestuous Lion",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "006",
  text: "Rush (This character can challenge the turn they're played.)\nChallenger +3 (While challenging, this character gets +3 {S}.)",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 47,
  inkable: false,
  externalIds: {
    ravensburger: "6dbd6b03dc064b8f9f8f15ddaa470e7b5632a534",
  },
  abilities: [
    {
      id: "ug5-1",
      text: "Rush",
      type: "keyword",
      keyword: "Rush",
    },
    {
      id: "ug5-2",
      text: "Challenger +3",
      type: "keyword",
      keyword: "Challenger",
      value: 3,
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
