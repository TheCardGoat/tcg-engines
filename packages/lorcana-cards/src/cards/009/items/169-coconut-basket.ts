import type { ItemCard } from "@tcg/lorcana-types";

export const coconutBasket: ItemCard = {
  id: "1d0",
  cardType: "item",
  name: "Coconut Basket",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "009",
  text: "CONSIDER THE COCONUT Whenever you play a character, you may remove up to 2 damage from chosen character.",
  cost: 2,
  cardNumber: 169,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b0aeb53ff83e9f3f9443625e4f795527ca5d86f3",
  },
  abilities: [
    {
      id: "1d0-1",
      type: "triggered",
      name: "CONSIDER THE COCONUT",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
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
      text: "CONSIDER THE COCONUT Whenever you play a character, you may remove up to 2 damage from chosen character.",
    },
  ],
};
