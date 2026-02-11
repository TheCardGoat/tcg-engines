import type { CharacterCard } from "@tcg/lorcana-types";

export const theHornedKingTriumphantGhoul: CharacterCard = {
  abilities: [
    {
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
      id: "1f3-1",
      text: "GRAND MACHINATIONS During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 49,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "King", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "b831740545b2d2cb2a770d2e9dabea11de92d522",
  },
  franchise: "Black Cauldron",
  fullName: "The Horned King - Triumphant Ghoul",
  id: "1f3",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Horned King",
  set: "010",
  strength: 2,
  text: "GRAND MACHINATIONS During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
  version: "Triumphant Ghoul",
  willpower: 2,
};
