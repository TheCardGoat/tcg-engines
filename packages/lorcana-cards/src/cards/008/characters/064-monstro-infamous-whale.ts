import type { CharacterCard } from "@tcg/lorcana-types";

export const monstroInfamousWhale: CharacterCard = {
  id: "7w3",
  cardType: "character",
  name: "Monstro",
  version: "Infamous Whale",
  fullName: "Monstro - Infamous Whale",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "008",
  text: "Rush (This character can challenge the turn they're played.)\nFULL BREACH Choose and discard a card – Ready this character. He can't quest for the rest of this turn.",
  cost: 8,
  strength: 6,
  willpower: 8,
  lore: 2,
  cardNumber: 64,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1c70c65c4d7b69c92748b9cb0841e95c8fb2f60d",
  },
  abilities: [
    {
      id: "7w3-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "7w3-2",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "FULL BREACH Choose and discard a card – Ready this character. He can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn"],
};
