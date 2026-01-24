import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodUnrivaledArcher: CharacterCard = {
  id: "v3n",
  cardType: "character",
  name: "Robin Hood",
  version: "Unrivaled Archer",
  fullName: "Robin Hood - Unrivaled Archer",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "009",
  text: "FEED THE POOR When you play this character, if an opponent has more cards in their hand than you, you may draw a card.\nGOOD SHOT During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 162,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "70178c995e77dc152c2c3be988201b087ac1a747",
  },
  abilities: [
    {
      id: "v3n-1",
      type: "triggered",
      name: "FEED THE POOR",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has more cards in their hand than you",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "FEED THE POOR When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
    },
    {
      id: "v3n-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "GOOD SHOT During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
