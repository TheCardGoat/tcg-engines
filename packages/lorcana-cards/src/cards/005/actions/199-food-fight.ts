import type { ActionCard } from "@tcg/lorcana-types";

export const foodFight: ActionCard = {
  id: "1ww",
  cardType: "action",
  name: "Food Fight!",
  inkType: ["steel"],
  set: "005",
  text: "Your characters gain “{E}, 1 {I} — Deal 1 damage to chosen character” this turn.",
  cost: 1,
  cardNumber: 199,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f85cdc600cc088e804abb8ad835dbe403eb00bdf",
  },
  abilities: [],
};
