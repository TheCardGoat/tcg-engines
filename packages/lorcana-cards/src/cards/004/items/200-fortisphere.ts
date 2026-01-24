import type { ItemCard } from "@tcg/lorcana-types";

export const fortisphere: ItemCard = {
  id: "s5n",
  cardType: "item",
  name: "Fortisphere",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "004",
  text: "RESOURCEFUL When you play this item, you may draw a card.\nEXTRACT OF STEEL 1 {I}, Banish this item — Chosen character of yours gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 1,
  cardNumber: 200,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "657a90059a6feb1b954c3f1140bec62e1776e73d",
  },
  abilities: [
    {
      id: "s5n-1",
      type: "triggered",
      name: "RESOURCEFUL",
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
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "RESOURCEFUL When you play this item, you may draw a card.",
    },
    {
      id: "s5n-2",
      type: "activated",
      effect: {
        type: "gain-keyword",
        keyword: "Bodyguard",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "EXTRACT OF STEEL 1 {I}, Banish this item — Chosen character of yours gains Bodyguard until the start of your next turn.",
    },
  ],
};
