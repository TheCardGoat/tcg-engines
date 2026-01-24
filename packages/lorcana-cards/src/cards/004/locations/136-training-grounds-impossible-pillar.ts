import type { LocationCard } from "@tcg/lorcana-types";

export const trainingGroundsImpossiblePillar: LocationCard = {
  id: "etf",
  cardType: "location",
  name: "Training Grounds",
  version: "Impossible Pillar",
  fullName: "Training Grounds - Impossible Pillar",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  text: "STRENGTH OF MIND 1 {I} — Chosen character here gets +1 {S} this turn.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 136,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "35674539959c7627310558941f91d1dac8adff48",
  },
  abilities: [
    {
      id: "etf-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "STRENGTH OF MIND 1 {I} — Chosen character here gets +1 {S} this turn.",
    },
  ],
};
