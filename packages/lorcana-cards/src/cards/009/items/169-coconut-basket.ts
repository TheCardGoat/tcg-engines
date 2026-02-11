import type { ItemCard } from "@tcg/lorcana-types";

export const coconutBasket: ItemCard = {
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
      id: "1d0-1",
      name: "CONSIDER THE COCONUT",
      text: "CONSIDER THE COCONUT Whenever you play a character, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 169,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "b0aeb53ff83e9f3f9443625e4f795527ca5d86f3",
  },
  franchise: "Moana",
  id: "1d0",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Coconut Basket",
  set: "009",
  text: "CONSIDER THE COCONUT Whenever you play a character, you may remove up to 2 damage from chosen character.",
};
