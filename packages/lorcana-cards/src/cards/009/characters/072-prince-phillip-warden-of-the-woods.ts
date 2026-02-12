import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipWardenOfTheWoods: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "CHOSEN_CHARACTER",
      },
      id: "1kf-1",
      name: "SHINING BEACON Your other Hero",
      text: "SHINING BEACON Your other Hero characters gain Ward.",
      type: "static",
    },
  ],
  cardNumber: 72,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "cb670ebd52463f804846e1f401536397d24fa5ac",
  },
  franchise: "Sleeping Beauty",
  fullName: "Prince Phillip - Warden of the Woods",
  id: "1kf",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Prince Phillip",
  set: "009",
  strength: 3,
  text: "SHINING BEACON Your other Hero characters gain Ward. (Opponents can’t choose them except to challenge.)",
  version: "Warden of the Woods",
  willpower: 4,
};
