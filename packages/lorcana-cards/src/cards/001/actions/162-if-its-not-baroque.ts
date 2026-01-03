import type { ActionCard } from "@tcg/lorcana-types";

export const ifItsNotBaroque: ActionCard = {
  id: "v94",
  cardType: "action",
  name: "If it’s Not Baroque",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Return an item card from your discard to your hand.",
  cost: 3,
  cardNumber: 162,
  inkable: false,
  externalIds: {
    ravensburger: "70a3ce5be1d7585ab65ae97f23db433fa975768b",
  },
  abilities: [
    {
      id: "v94-1",
      text: "Return an item card from your discard to your hand.",
      type: "action",
      effect: {
        type: "return-from-discard",
        cardType: "item",
        target: "CONTROLLER",
      },
    },
  ],
};
