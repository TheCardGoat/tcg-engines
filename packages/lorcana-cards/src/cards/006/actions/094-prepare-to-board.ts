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
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4e596a3444f05ec541e3386bc403faa66729f7d0",
  },
  abilities: [],
};
