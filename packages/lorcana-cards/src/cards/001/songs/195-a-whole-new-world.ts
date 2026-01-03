import type { ActionCard } from "@tcg/lorcana-types";

export const AWholeNewWorldUndefined: ActionCard = {
  id: "u8m",
  cardType: "action",
  name: "A Whole New World",
  version: "undefined",
  fullName: "A Whole New World - undefined",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
  cost: 5,
  actionSubtype: "song",
  cardNumber: 195,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "_(A character with cost 5 or more can {E} to sing this\nsong for free.)_\nEach player discards their hand and draws 7 cards.",
      id: "u8m-1",
      effect: {
        type: "draw",
        amount: 7,
        target: "EACH_PLAYER",
      },
    },
  ],
};
