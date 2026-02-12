import type { CharacterCard } from "@tcg/lorcana-types";

export const flintheartGlomgoldSchemingBillionaire: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Ward",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "l2o-1",
      text: "TRY ME While you have a character or location in play with a card under them, this character gains Ward.",
      type: "action",
    },
  ],
  cardNumber: 76,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "4bf477933d696ffd96d9d3c933e07689ec893de3",
  },
  franchise: "Ducktales",
  fullName: "Flintheart Glomgold - Scheming Billionaire",
  id: "l2o",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Flintheart Glomgold",
  set: "010",
  strength: 1,
  text: "TRY ME While you have a character or location in play with a card under them, this character gains Ward. (Opponents can't choose them except to challenge.)",
  version: "Scheming Billionaire",
  willpower: 4,
};
