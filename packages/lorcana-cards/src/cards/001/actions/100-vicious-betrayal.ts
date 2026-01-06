import type { ActionCard } from "@tcg/lorcana-types";

export const viciousBetrayal: ActionCard = {
  id: "e6i",
  cardType: "action",
  name: "Vicious Betrayal",
  version: "undefined",
  fullName: "Vicious Betrayal - undefined",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
  cost: 1,
  cardNumber: 100,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
      id: "e6i-1",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "a Villain character is chosen",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "CHOSEN_CHARACTER",
        },
      },
    },
  ],
};
