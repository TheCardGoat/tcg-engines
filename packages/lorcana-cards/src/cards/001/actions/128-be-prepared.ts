import type { ActionCard } from "@tcg/lorcana-types";

export const bePrepared: ActionCard = {
  id: "j9z",
  cardType: "action",
  name: "Be Prepared",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "001",
  text: "Banish all characters.",
  actionSubtype: "song",
  cost: 7,
  cardNumber: 128,
  inkable: false,
  externalIds: {
    ravensburger: "4579dd841c902f1f7a336b3776c97a974e5f3369",
  },
  abilities: [
    {
      id: "j9z-1",
      text: "Banish all characters.",
      type: "action",
      effect: {
        type: "banish",
        target: "ALL_CHARACTERS",
      },
    },
  ],
};
