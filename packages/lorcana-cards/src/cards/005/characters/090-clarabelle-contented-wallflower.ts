import type { CharacterCard } from "@tcg/lorcana";

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
  externalIds: {
    ravensburger: "f2123da0366f4fab7d748e1632bb5c20732c94ab",
  },
  abilities: [
    {
      id: "1v9-1",
      text: "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
      name: "ONE STEP BEHIND",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "OPPONENT",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
