import type { ActionCard } from "@tcg/lorcana-types";

export const intoTheUnknown: ActionCard = {
  id: "1ef",
  cardType: "action",
  name: "Into the Unknown",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "008",
  text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 81,
  inkable: true,
  externalIds: {
    ravensburger: "b506d722beed28386dc44ada619ef650102342b8",
  },
  abilities: [
    {
      id: "1ef-1",
      text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: {
          selector: "chosen",
          count: { exactly: 1 },
          filter: [{ type: "exerted" }],
        },
        target: "CARD_OWNER",
        exerted: true,
      },
    },
  ],
};
