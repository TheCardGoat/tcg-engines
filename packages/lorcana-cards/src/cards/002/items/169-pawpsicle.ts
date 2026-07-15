import type { ItemCard } from "@tcg/lorcana-types";

export const pawpsicle: ItemCard = {
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
      id: "s1u-1",
      name: "JUMBO POP",
      text: "JUMBO POP When you play this item, you may draw a card.",
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
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "s1u-2",
      text: "THAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.",
      type: "activated",
    },
  ],
  cardNumber: 169,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "651952e179e63cca4db165a7416ab0c4d3f16556",
  },
  franchise: "Zootropolis",
  id: "s1u",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Pawpsicle",
  set: "002",
  text: "JUMBO POP When you play this item, you may draw a card.\nTHAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.",
};
