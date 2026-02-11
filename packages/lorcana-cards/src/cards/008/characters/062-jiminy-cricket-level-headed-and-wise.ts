import type { CharacterCard } from "@tcg/lorcana-types";

export const jiminyCricketLevelheadedAndWise: CharacterCard = {
  abilities: [
    {
      id: "1i2-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
      id: "1i2-2",
      text: "ENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.",
      type: "static",
    },
  ],
  cardNumber: 62,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 2,
  externalIds: {
    ravensburger: "c2d952bc046311e7e80e6aa1f93f0c3a5dd37fe1",
  },
  franchise: "Pinocchio",
  fullName: "Jiminy Cricket - Level-Headed and Wise",
  id: "1i2",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Jiminy Cricket",
  set: "008",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.",
  version: "Level-Headed and Wise",
  willpower: 1,
};
