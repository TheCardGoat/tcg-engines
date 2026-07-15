import type { ActionCard } from "@tcg/lorcana-types";

export const oneLastHope: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "13s-1",
      text: "Chosen character gains Resist +2 until the start of your next turn. If a Hero character is chosen, they can also challenge ready characters this turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 197,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "8f6416c63cac0fad17fdf749cf9ede58f5fd446b",
  },
  franchise: "Hercules",
  id: "13s",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "One Last Hope",
  set: "009",
  text: "Chosen character gains Resist +2 until the start of your next turn. If a Hero character is chosen, they can also challenge ready characters this turn. (Damage dealt to them is reduced by 2.)",
};
