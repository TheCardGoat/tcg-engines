import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodUnrivaledArcher: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "an opponent has more cards in their hand than you",
          type: "if",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "v3n-1",
      name: "FEED THE POOR",
      text: "FEED THE POOR When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "v3n-2",
      text: "GOOD SHOT During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 162,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "70178c995e77dc152c2c3be988201b087ac1a747",
  },
  franchise: "Robin Hood",
  fullName: "Robin Hood - Unrivaled Archer",
  id: "v3n",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Robin Hood",
  set: "009",
  strength: 4,
  text: "FEED THE POOR When you play this character, if an opponent has more cards in their hand than you, you may draw a card.\nGOOD SHOT During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Unrivaled Archer",
  willpower: 4,
};
