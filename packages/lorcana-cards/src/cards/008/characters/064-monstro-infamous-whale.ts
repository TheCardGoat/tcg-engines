import type { CharacterCard } from "@tcg/lorcana-types";

export const monstroInfamousWhale: CharacterCard = {
  abilities: [
    {
      id: "7w3-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
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
      id: "7w3-2",
      text: "FULL BREACH Choose and discard a card – Ready this character. He can't quest for the rest of this turn.",
      type: "action",
    },
  ],
  cardNumber: 64,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 8,
  externalIds: {
    ravensburger: "1c70c65c4d7b69c92748b9cb0841e95c8fb2f60d",
  },
  franchise: "Pinocchio",
  fullName: "Monstro - Infamous Whale",
  id: "7w3",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Monstro",
  set: "008",
  strength: 6,
  text: "Rush (This character can challenge the turn they're played.)\nFULL BREACH Choose and discard a card – Ready this character. He can't quest for the rest of this turn.",
  version: "Infamous Whale",
  willpower: 8,
};
