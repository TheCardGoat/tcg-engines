import type { ActionCard } from "@tcg/lorcana-types";

export const healingGlow: ActionCard = {
  id: "1ix",
  cardType: "action",
  name: "Healing Glow",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "001",
  text: "Remove up to 2 damage from chosen character.",
  cost: 1,
  cardNumber: 28,
  inkable: true,
  externalIds: {
    ravensburger: "c4353a13ff7ad0865ca1e7860a6c5feb8d15866d",
  },
  abilities: [
    {
      id: "1ix-1",
      text: "Remove up to 2 damage from chosen character.",
      type: "action",
      effect: {
        type: "remove-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
        upTo: true,
      },
    },
  ],
};
