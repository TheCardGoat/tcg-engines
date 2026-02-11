import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPansShadowNotSewnOn: CharacterCard = {
  abilities: [
    {
      id: "1n6-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      id: "1n6-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
      id: "1n6-3",
      text: "TIPTOE Your other characters with Rush gain Evasive.",
      type: "action",
    },
  ],
  cardNumber: 42,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "d5557ab7eb7b97bdfce53586c13fcb4c32995437",
  },
  franchise: "Peter Pan",
  fullName: "Peter Pan's Shadow - Not Sewn On",
  id: "1n6",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Peter Pan's Shadow",
  set: "009",
  strength: 2,
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)\nTIPTOE Your other characters with Rush gain Evasive.",
  version: "Not Sewn On",
  willpower: 3,
};
