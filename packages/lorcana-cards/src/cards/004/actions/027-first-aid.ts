import type { ActionCard } from "@tcg/lorcana-types";

export const firstAid: ActionCard = {
  id: "1ha",
  cardType: "action",
  name: "First Aid",
  inkType: ["amber"],
  set: "004",
  text: "Remove up to 1 damage from each of your characters.",
  cost: 1,
  cardNumber: 27,
  inkable: true,
  externalIds: {
    ravensburger: "c0a5e3fc4e2e37085c62af71ef02f6136af750d2",
  },
  abilities: [
    {
      id: "1ha-1",
      text: "Remove up to 3 damage from each of your characters.",
      name: "Hakuna Matata",
      type: "action",
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
    },
  ],
};
