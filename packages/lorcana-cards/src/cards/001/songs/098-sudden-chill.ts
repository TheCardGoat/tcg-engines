import type { ActionCard } from "@tcg/lorcana-types";

export const SuddenChillUndefined: ActionCard = {
  id: "pz4",
  cardType: "action",
  name: "Sudden Chill",
  version: "undefined",
  fullName: "Sudden Chill - undefined",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "Each opponent chooses and discards a card.",
  cost: 2,
  actionSubtype: "song",
  cardNumber: 98,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "Each opponent chooses and discards a card.",
      id: "pz4-1",
      effect: {
        type: "discard",
        amount: 1,
        target: "EACH_OPPONENT",
        chosen: true,
      },
    },
  ],
  classifications: ["action", "song"],
};
