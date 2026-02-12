import type { ActionCard } from "@tcg/lorcana-types";

export const intoTheUnknown: ActionCard = {
  abilities: [
    {
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "CARD_OWNER",
        exerted: true,
      },
      id: "1ef-1",
      text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 81,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "b506d722beed28386dc44ada619ef650102342b8",
  },
  franchise: "Frozen",
  id: "1ef",
  inkType: ["amethyst", "sapphire"],
  inkable: true,
  name: "Into the Unknown",
  set: "008",
  text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
};
