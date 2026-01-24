import type { ItemCard } from "@tcg/lorcana-types";

export const pawpsicle: ItemCard = {
  id: "s1u",
  cardType: "item",
  name: "Pawpsicle",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  text: "JUMBO POP When you play this item, you may draw a card.\nTHAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.",
  cost: 1,
  cardNumber: 169,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "651952e179e63cca4db165a7416ab0c4d3f16556",
  },
  abilities: [
    {
      id: "s1u-1",
      type: "triggered",
      name: "JUMBO POP",
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
      text: "JUMBO POP When you play this item, you may draw a card.",
    },
    {
      id: "s1u-2",
      type: "activated",
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "THAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.",
    },
  ],
};
