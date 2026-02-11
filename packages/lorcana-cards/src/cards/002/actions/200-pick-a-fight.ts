import type { ActionCard } from "@tcg/lorcana-types";

export const pickAFight: ActionCard = {
  abilities: [
    {
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
      },
      id: "zph-1",
      text: "Chosen character can challenge ready characters this turn.",
      type: "action",
    },
  ],
  cardNumber: 200,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "80b19310099db7717fc69d00ac3c45f408c38276",
  },
  franchise: "Wreck It Ralph",
  id: "zph",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "Pick a Fight",
  set: "002",
  text: "Chosen character can challenge ready characters this turn.",
};
