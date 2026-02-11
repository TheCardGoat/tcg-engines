import type { ItemCard } from "@tcg/lorcana-types";

export const fortisphere: ItemCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "s5n-1",
      name: "RESOURCEFUL",
      text: "RESOURCEFUL When you play this item, you may draw a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      cost: { exert: true },
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
