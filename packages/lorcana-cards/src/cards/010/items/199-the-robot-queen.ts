import type { ItemCard } from "@tcg/lorcana-types";

export const theRobotQueen: ItemCard = {
  id: "n1t",
  cardType: "item",
  name: "The Robot Queen",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "010",
  text: "MAJOR MALFUNCTION Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.",
  cost: 1,
  cardNumber: 199,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "53133ab50ca19d277b331206bf608e32ae359deb",
  },
  abilities: [
    {
      id: "n1t-1",
      type: "triggered",
      name: "MAJOR MALFUNCTION",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "MAJOR MALFUNCTION Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.",
    },
  ],
};
