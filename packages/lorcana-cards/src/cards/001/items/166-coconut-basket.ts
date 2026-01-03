import type { ItemCard } from "@tcg/lorcana-types";

export const CoconutBasketUndefined: ItemCard = {
  id: "hoh",
  cardType: "item",
  name: "Coconut Basket",
  version: "undefined",
  fullName: "Coconut Basket - undefined",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "**CONSIDER THE COCONUT** Whenever you play a character,\ryou may remove up to 2 damage from chosen character.",
  cost: 2,
  cardNumber: 166,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
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
    },
  ],
};
