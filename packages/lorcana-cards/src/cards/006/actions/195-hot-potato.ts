import type { ActionCard } from "@tcg/lorcana-types";

export const hotPotato: ActionCard = {
  id: "jnj",
  cardType: "action",
  name: "Hot Potato",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "Choose one:\n- Deal 2 damage to chosen character.\n- Banish chosen item.",
  cost: 3,
  cardNumber: 195,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "46d569174be105bf3722b7146e7d4b850b976412",
  },
  abilities: [],
};
