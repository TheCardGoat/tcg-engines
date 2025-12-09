import type { ActionCard } from "@tcg/lorcana";

export const controlYourTemper: ActionCard = {
  id: "nur",
  cardType: "action",
  name: "Control Your Temper!",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Chosen character gets -2 {S} this turn.",
  cost: 1,
  cardNumber: 26,
  inkable: true,
  externalIds: {
    ravensburger: "55f9630150960925f548c841768e0cd6ac3aa1ef",
  },
  abilities: [
    {
      id: "nur-1",
      text: "Chosen character gets -2 {S} this turn.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "turn",
      },
    },
  ],
};
