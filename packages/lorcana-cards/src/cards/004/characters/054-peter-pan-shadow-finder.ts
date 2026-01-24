import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanShadowFinder: CharacterCard = {
  id: "g3g",
  cardType: "character",
  name: "Peter Pan",
  version: "Shadow Finder",
  fullName: "Peter Pan - Shadow Finder",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "004",
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nFLY, OF COURSE! Your other characters with Evasive gain Rush.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 54,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3a02b32b7275fe9cb597814a840f682abcc7a7ae",
  },
  abilities: [
    {
      id: "g3g-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "g3g-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "g3g-3",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
      },
      text: "FLY, OF COURSE! Your other characters with Evasive gain Rush.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
