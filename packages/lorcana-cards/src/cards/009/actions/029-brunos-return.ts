import type { ActionCard } from "@tcg/lorcana-types";

export const brunosReturn: ActionCard = {
  id: "ka9",
  cardType: "action",
  name: "Bruno's Return",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "009",
  text: "Return a character card from your discard to your hand. You may remove up to 2 damage from chosen character.",
  cost: 2,
  cardNumber: 29,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "491ba73c6014d66a41525858502fc4bf26828e36",
  },
  abilities: [
    {
      id: "ka9-1",
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
      text: "Return a character card from your discard to your hand. You may remove up to 2 damage from chosen character.",
    },
  ],
};
