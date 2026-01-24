import type { ItemCard } from "@tcg/lorcana-types";

export const inkrunner: ItemCard = {
  id: "u80",
  cardType: "item",
  name: "Inkrunner",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "010",
  text: "PREFLIGHT CHECK When you play this item, draw a card.\nREADY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
  cost: 2,
  cardNumber: 169,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6cecb04c1876e48d66d77a98284509e6af7937d8",
  },
  abilities: [
    {
      id: "u80-1",
      type: "triggered",
      name: "PREFLIGHT CHECK",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "PREFLIGHT CHECK When you play this item, draw a card.",
    },
    {
      id: "u80-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "READY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn.",
    },
  ],
};
