import type { ActionCard } from "@tcg/lorcana-types";

export const prepareToBoard: ActionCard = {
  id: "lql",
  cardType: "action",
  name: "Prepare to Board!",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "006",
  text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
  cost: 1,
  cardNumber: 94,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4e596a3444f05ec541e3386bc403faa66729f7d0",
  },
  abilities: [
    {
      id: "lql-1",
      type: "action",
      effect: {
        type: "conditional",
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
      },
      text: "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
    },
  ],
};
