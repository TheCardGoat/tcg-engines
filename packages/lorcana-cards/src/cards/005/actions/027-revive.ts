import type { ActionCard } from "@tcg/lorcana-types";

export const revive: ActionCard = {
  abilities: [
    {
      effect: {
        cost: "free",
        from: "discard",
        type: "play-card",
      },
      id: "16b-1",
      text: "Play a character card with cost 5 or less from your discard for free.",
      type: "action",
    },
  ],
  cardNumber: 27,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "97dd8cdfab89963b2a8c0116f6a21bf32932860e",
  },
  franchise: "Tangled",
  id: "16b",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Revive",
  set: "005",
  text: "Play a character card with cost 5 or less from your discard for free.",
};
