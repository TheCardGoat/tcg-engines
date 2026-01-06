import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesDaringDemigod: CharacterCard = {
  id: "1s3",
  cardType: "character",
  name: "Hercules",
  version: "Daring Demigod",
  fullName: "Hercules - Daring Demigod",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "004",
  text: "Rush (This character can challenge the turn they're played.)\nReckless (This character can't quest and must challenge each turn if able.)",
  cost: 5,
  strength: 7,
  willpower: 3,
  lore: 0,
  cardNumber: 109,
  inkable: false,
  externalIds: {
    ravensburger: "e9542280047f44a8111ed52fe2df8057e99a594b",
  },
  abilities: [
    {
      id: "1s3-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "1s3-2",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
