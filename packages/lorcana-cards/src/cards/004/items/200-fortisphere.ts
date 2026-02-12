import type { ItemCard } from "@tcg/lorcana-types";

export const fortisphere: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "s5n-1",
      name: "RESOURCEFUL",
      text: "RESOURCEFUL When you play this item, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      cost: { exert: true },
      effect: {
        keyword: "Bodyguard",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "s5n-2",
      text: "EXTRACT OF STEEL 1 {I}, Banish this item — Chosen character of yours gains Bodyguard until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 200,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "657a90059a6feb1b954c3f1140bec62e1776e73d",
  },
  franchise: "Lorcana",
  id: "s5n",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Fortisphere",
  set: "004",
  text: "RESOURCEFUL When you play this item, you may draw a card.\nEXTRACT OF STEEL 1 {I}, Banish this item — Chosen character of yours gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
};
