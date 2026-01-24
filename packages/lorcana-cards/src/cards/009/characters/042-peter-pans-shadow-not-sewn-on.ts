import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPansShadowNotSewnOn: CharacterCard = {
  id: "1n6",
  cardType: "character",
  name: "Peter Pan's Shadow",
  version: "Not Sewn On",
  fullName: "Peter Pan's Shadow - Not Sewn On",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "009",
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nTIPTOE Your other characters with Rush gain Evasive.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 42,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "d5557ab7eb7b97bdfce53586c13fcb4c32995437",
  },
  abilities: [
    {
      id: "1n6-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "1n6-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1n6-3",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
      text: "TIPTOE Your other characters with Rush gain Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
