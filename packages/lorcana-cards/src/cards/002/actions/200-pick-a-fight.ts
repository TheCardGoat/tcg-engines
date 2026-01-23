import type { ActionCard } from "@tcg/lorcana-types";

export const pickAFight: ActionCard = {
  id: "zph",
  cardType: "action",
  name: "Pick a Fight",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "002",
  text: "Chosen character can challenge ready characters this turn.",
  cost: 2,
  cardNumber: 200,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "80b19310099db7717fc69d00ac3c45f408c38276",
  },
  abilities: [],
};
