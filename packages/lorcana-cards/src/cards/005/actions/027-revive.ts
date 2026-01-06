import type { ActionCard } from "@tcg/lorcana-types";

export const revive: ActionCard = {
  id: "16b",
  cardType: "action",
  name: "Revive",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "005",
  text: "Play a character card with cost 5 or less from your discard for free.",
  cost: 5,
  cardNumber: 27,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "97dd8cdfab89963b2a8c0116f6a21bf32932860e",
  },
  abilities: [],
};
