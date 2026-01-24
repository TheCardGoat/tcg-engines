import type { ActionCard } from "@tcg/lorcana-types";

export const everAsBefore: ActionCard = {
  id: "1br",
  cardType: "action",
  name: "Ever as Before",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "Remove up to 2 damage from any number of chosen characters.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 162,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ac2e4ae31b17ef873ac04d7effc1655e403418b9",
  },
  abilities: [
    {
      id: "1br-1",
      type: "action",
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
      text: "Remove up to 2 damage from any number of chosen characters.",
    },
  ],
};
