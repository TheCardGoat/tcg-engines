import type { CharacterCard } from "@tcg/lorcana-types";

export const clarabelleContentedWallflower: CharacterCard = {
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
      id: "1v9-1",
      name: "ONE STEP BEHIND",
      text: "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 90,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "f2123da0366f4fab7d748e1632bb5c20732c94ab",
  },
  fullName: "Clarabelle - Contented Wallflower",
  id: "1v9",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Clarabelle",
  set: "005",
  strength: 2,
  text: "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
  version: "Contented Wallflower",
  willpower: 3,
};
