import type { ActionCard } from "@tcg/lorcana-types";

export const firstAid: ActionCard = {
  abilities: [
    {
      effect: {
        type: "remove-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
        upTo: true,
      },
      id: "1ha-1",
      name: "Hakuna Matata",
      text: "Remove up to 3 damage from each of your characters.",
      type: "action",
    },
  ],
  cardNumber: 27,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "c0a5e3fc4e2e37085c62af71ef02f6136af750d2",
  },
  id: "1ha",
  inkType: ["amber"],
  inkable: true,
  name: "First Aid",
  set: "004",
  text: "Remove up to 1 damage from each of your characters.",
};
