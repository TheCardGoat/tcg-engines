import type { ActionCard } from "@tcg/lorcana-types";

export const chomp: ActionCard = {
  id: "1vk",
  cardType: "action",
  name: "Chomp!",
  inkType: ["emerald"],
  set: "010",
  text: "Deal 2 damage to chosen damaged character.",
  cost: 1,
  cardNumber: 96,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f2bfe0126cb97db208b3a641bc8ed5e361bae0cf",
  },
  abilities: [
    {
      id: "1vk-1",
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Deal 2 damage to chosen damaged character.",
    },
  ],
};
