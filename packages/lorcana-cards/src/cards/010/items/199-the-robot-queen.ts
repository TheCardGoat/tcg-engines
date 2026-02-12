import type { ItemCard } from "@tcg/lorcana-types";

export const theRobotQueen: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "n1t-1",
      name: "MAJOR MALFUNCTION",
      text: "MAJOR MALFUNCTION Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 199,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "53133ab50ca19d277b331206bf608e32ae359deb",
  },
  franchise: "Great Mouse Detective",
  id: "n1t",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "The Robot Queen",
  set: "010",
  text: "MAJOR MALFUNCTION Whenever you play a character, you may pay 1 {I} and banish this item to deal 2 damage to chosen character.",
};
