import type { ItemCard } from "@tcg/lorcana-types";

export const steelCoil: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          chosen: true,
          target: "CONTROLLER",
          type: "discard",
        },
        type: "optional",
      },
      id: "1y9-1",
      name: "METALLIC FLOW",
      text: "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 203,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "ffb0c77401e035728f3eb2f32bed33d56dcc8e09",
  },
  franchise: "Lorcana",
  id: "1y9",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Steel Coil",
  set: "007",
  text: "METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
};
