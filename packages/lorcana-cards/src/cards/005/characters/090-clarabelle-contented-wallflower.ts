import type { CharacterCard } from "@tcg/lorcana-types";

export const clarabelleContentedWallflower: CharacterCard = {
  id: "1v9",
  cardType: "character",
  name: "Clarabelle",
  version: "Contented Wallflower",
  fullName: "Clarabelle - Contented Wallflower",
  inkType: ["emerald"],
  set: "005",
  text: "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 90,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f2123da0366f4fab7d748e1632bb5c20732c94ab",
  },
  abilities: [
    {
      id: "1v9-1",
      type: "triggered",
      name: "ONE STEP BEHIND",
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
      text: "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
