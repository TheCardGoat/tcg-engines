import type { CharacterCard } from "@tcg/lorcana";

export const gastonBaritoneBully: CharacterCard = {
  id: "6hk",
  cardType: "character",
  name: "Gaston",
  version: "Baritone Bully",
  fullName: "Gaston - Baritone Bully",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)",
  cardNumber: "008",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "176214ba5544b38d31aa4d2d706edd897e07259a",
  },
  keywords: [
    {
      type: "Singer",
      value: 5,
    },
  ],
  abilities: [
    {
      id: "6hk-1",
      text: "Singer 5",
      type: "keyword",
      keyword: "Singer",
      value: 5,
    },
  ],
  classifications: ["Dreamborn", "Villain"],
};
