import type { ItemCard } from "@tcg/lorcana-types";

export const inkrunner: ItemCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      id: "u80-1",
      name: "PREFLIGHT CHECK",
      text: "PREFLIGHT CHECK When you play this item, draw a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
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
      id: "u80-2",
      text: "READY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn.",
      type: "action",
    },
  ],
  cardNumber: 169,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "6cecb04c1876e48d66d77a98284509e6af7937d8",
  },
  franchise: "Lorcana",
  id: "u80",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Inkrunner",
  set: "010",
  text: "PREFLIGHT CHECK When you play this item, draw a card.\nREADY TO RIDE {E}, 1 {I} - Chosen character gains Alert this turn. (They can challenge as if they had Evasive.)",
};
