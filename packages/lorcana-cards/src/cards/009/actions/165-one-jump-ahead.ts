import type { ActionCard } from "@tcg/lorcana-types";

export const oneJumpAhead: ActionCard = {
  abilities: [
    {
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      id: "1xl-1",
      text: "Put the top card of your deck into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 165,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "fbc3343ba157343b6f977e1486027bbe0b7ab1f7",
  },
  franchise: "Aladdin",
  id: "1xl",
  inkType: ["sapphire"],
  inkable: false,
  missingTests: true,
  name: "One Jump Ahead",
  set: "009",
  text: "Put the top card of your deck into your inkwell facedown and exerted.",
};
