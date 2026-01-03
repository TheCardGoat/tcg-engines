import type { ActionCard } from "@tcg/lorcana-types";

export const OneJumpAheadUndefined: ActionCard = {
  id: "gf6",
  cardType: "action",
  name: "One Jump Ahead",
  version: "undefined",
  fullName: "One Jump Ahead - undefined",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\nPut the top card of your deck into your inkwell facedown and exerted.",
  cost: 2,
  actionSubtype: "song",
  cardNumber: 164,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\nPut the top card of your deck into your inkwell facedown and exerted.",
      id: "gf6-1",
      effect: {
        type: "put-into-inkwell",
        source: "top-of-deck",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
    },
  ],
  classifications: ["action", "song"],
};
