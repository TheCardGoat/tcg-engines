import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipWardenOfTheWoods: CharacterCard = {
  id: "1kf",
  cardType: "character",
  name: "Prince Phillip",
  version: "Warden of the Woods",
  fullName: "Prince Phillip - Warden of the Woods",
  inkType: ["emerald"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "SHINING BEACON Your other Hero characters gain Ward. (Opponents can’t choose them except to challenge.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 72,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "cb670ebd52463f804846e1f401536397d24fa5ac",
  },
  abilities: [
    {
      id: "1kf-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHOSEN_CHARACTER",
      },
      name: "SHINING BEACON Your other Hero",
      text: "SHINING BEACON Your other Hero characters gain Ward.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
