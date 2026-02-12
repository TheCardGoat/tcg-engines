import type { ActionCard } from "@tcg/lorcana-types";

export const prepareToBoard: ActionCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "a Pirate character is chosen",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "CHOSEN_CHARACTER",
        },
        type: "conditional",
      },
      id: "lql-1",
      text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
      type: "action",
    },
  ],
  cardNumber: 94,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "4e596a3444f05ec541e3386bc403faa66729f7d0",
  },
  franchise: "Peter Pan",
  id: "lql",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Prepare to Board!",
  set: "006",
  text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
};
