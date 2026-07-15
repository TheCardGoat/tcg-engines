import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanShadowFinder: CharacterCard = {
  abilities: [
    {
      id: "g3g-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      id: "g3g-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "g3g-3",
      text: "FLY, OF COURSE! Your other characters with Evasive gain Rush.",
      type: "action",
    },
  ],
  cardNumber: 54,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "3a02b32b7275fe9cb597814a840f682abcc7a7ae",
  },
  franchise: "Peter Pan",
  fullName: "Peter Pan - Shadow Finder",
  id: "g3g",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Peter Pan",
  set: "004",
  strength: 2,
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nFLY, OF COURSE! Your other characters with Evasive gain Rush.",
  version: "Shadow Finder",
  willpower: 3,
};
