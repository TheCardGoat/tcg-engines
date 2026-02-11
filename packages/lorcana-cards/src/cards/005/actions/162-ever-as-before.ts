import type { ActionCard } from "@tcg/lorcana-types";

export const everAsBefore: ActionCard = {
  abilities: [
    {
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
