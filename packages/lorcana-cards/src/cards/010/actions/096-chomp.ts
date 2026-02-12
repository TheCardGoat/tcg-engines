import type { ActionCard } from "@tcg/lorcana-types";

export const chomp: ActionCard = {
  abilities: [
    {
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
      id: "1vk-1",
      text: "Deal 2 damage to chosen damaged character.",
      type: "action",
    },
  ],
  cardNumber: 96,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "f2bfe0126cb97db208b3a641bc8ed5e361bae0cf",
  },
  id: "1vk",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Chomp!",
  set: "010",
  text: "Deal 2 damage to chosen damaged character.",
};
