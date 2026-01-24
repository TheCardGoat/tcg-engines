import type { ItemCard } from "@tcg/lorcana-types";

export const steelCoil: ItemCard = {
  id: "1y9",
  cardType: "item",
  name: "Steel Coil",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "007",
  text: "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
  cost: 2,
  cardNumber: 203,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "ffb0c77401e035728f3eb2f32bed33d56dcc8e09",
  },
  abilities: [
    {
      id: "1y9-1",
      type: "triggered",
      name: "METALLIC FLOW",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
    },
  ],
};
