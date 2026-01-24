import type { CharacterCard } from "@tcg/lorcana-types";

export const jiminyCricketLevelheadedAndWise: CharacterCard = {
  id: "1i2",
  cardType: "character",
  name: "Jiminy Cricket",
  version: "Level-Headed and Wise",
  fullName: "Jiminy Cricket - Level-Headed and Wise",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 62,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c2d952bc046311e7e80e6aa1f93f0c3a5dd37fe1",
  },
  abilities: [
    {
      id: "1i2-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1i2-2",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      text: "ENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
