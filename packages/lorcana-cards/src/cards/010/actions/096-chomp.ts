import type { ActionCard } from "@tcg/lorcana-types";

export const chomp: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
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
