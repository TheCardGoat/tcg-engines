import type { ItemCard } from "@tcg/lorcana-types";

export const amberCoil: ItemCard = {
  abilities: [
    {
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
      id: "7an-1",
      name: "HEALING AURA",
      text: "HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 41,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "1a4b8495891072543683523882d11f76e3883842",
  },
  franchise: "Lorcana",
  id: "7an",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Amber Coil",
  set: "007",
  text: "HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
};
