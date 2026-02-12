import type { ActionCard } from "@tcg/lorcana-types";

export const suddenChill: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "1ck-1",
      text: "Each opponent chooses and discards a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 95,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "af0402088e469d5b1093c6206c115b0e96e599c3",
  },
  franchise: "101 Dalmatians",
  id: "1ck",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Sudden Chill",
  set: "009",
  text: "Each opponent chooses and discards a card.",
};
