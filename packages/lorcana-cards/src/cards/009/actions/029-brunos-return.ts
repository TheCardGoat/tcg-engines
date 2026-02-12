import type { ActionCard } from "@tcg/lorcana-types";

export const brunosReturn: ActionCard = {
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
      id: "ka9-1",
      text: "Return a character card from your discard to your hand. You may remove up to 2 damage from chosen character.",
      type: "action",
    },
  ],
  cardNumber: 29,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "491ba73c6014d66a41525858502fc4bf26828e36",
  },
  franchise: "Encanto",
  id: "ka9",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Bruno's Return",
  set: "009",
  text: "Return a character card from your discard to your hand. You may remove up to 2 damage from chosen character.",
};
