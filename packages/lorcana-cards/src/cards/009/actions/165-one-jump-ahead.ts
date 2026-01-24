import type { ActionCard } from "@tcg/lorcana-types";

export const oneJumpAhead: ActionCard = {
  id: "1xl",
  cardType: "action",
  name: "One Jump Ahead",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "009",
  text: "Put the top card of your deck into your inkwell facedown and exerted.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 165,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "fbc3343ba157343b6f977e1486027bbe0b7ab1f7",
  },
  abilities: [
    {
      id: "1xl-1",
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      text: "Put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
};
