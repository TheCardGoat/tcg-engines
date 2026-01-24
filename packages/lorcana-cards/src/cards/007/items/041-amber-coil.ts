import type { ItemCard } from "@tcg/lorcana-types";

export const amberCoil: ItemCard = {
  id: "7an",
  cardType: "item",
  name: "Amber Coil",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "007",
  text: "HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
  cost: 1,
  cardNumber: 41,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1a4b8495891072543683523882d11f76e3883842",
  },
  abilities: [
    {
      id: "7an-1",
      type: "triggered",
      name: "HEALING AURA",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
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
        chooser: "CONTROLLER",
      },
      text: "HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
    },
  ],
};
