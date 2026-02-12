import type { ActionCard } from "@tcg/lorcana-types";

export const everAsBefore: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "1br-1",
      text: "Remove up to 2 damage from any number of chosen characters.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 162,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "ac2e4ae31b17ef873ac04d7effc1655e403418b9",
  },
  franchise: "Beauty and the Beast",
  id: "1br",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Ever as Before",
  set: "005",
  text: "Remove up to 2 damage from any number of chosen characters.",
};
