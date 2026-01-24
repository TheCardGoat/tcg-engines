import type { CharacterCard } from "@tcg/lorcana-types";

export const theHornedKingTriumphantGhoul: CharacterCard = {
  id: "1f3",
  cardType: "character",
  name: "The Horned King",
  version: "Triumphant Ghoul",
  fullName: "The Horned King - Triumphant Ghoul",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  text: "GRAND MACHINATIONS During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b831740545b2d2cb2a770d2e9dabea11de92d522",
  },
  abilities: [
    {
      id: "1f3-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "1 or more cards have left a player's discard this turn",
        },
        then: {
          type: "modify-stat",
          stat: "lore",
          modifier: 2,
          target: "SELF",
        },
      },
      text: "GRAND MACHINATIONS During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "King", "Sorcerer"],
};
