import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesDaringDemigod: CharacterCard = {
  abilities: [
    {
      id: "1s3-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      id: "1s3-2",
      keyword: "Reckless",
      text: "Reckless",
      type: "keyword",
    },
  ],
  cardNumber: 109,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 5,
  externalIds: {
    ravensburger: "e9542280047f44a8111ed52fe2df8057e99a594b",
  },
  franchise: "Hercules",
  fullName: "Hercules - Daring Demigod",
  id: "1s3",
  inkType: ["ruby"],
  inkable: false,
  lore: 0,
  name: "Hercules",
  set: "004",
  strength: 7,
  text: "Rush (This character can challenge the turn they're played.)\nReckless (This character can't quest and must challenge each turn if able.)",
  version: "Daring Demigod",
  willpower: 3,
};
