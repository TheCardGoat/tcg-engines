import type { CharacterCard } from "@tcg/lorcana-types";

export const mushuFasttalkingDragon: CharacterCard = {
  id: "17r",
  cardType: "character",
  name: "Mushu",
  version: "Fast-Talking Dragon",
  fullName: "Mushu - Fast-Talking Dragon",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "008",
  text: "LET'S GET THIS SHOW ON THE ROAD {E} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 130,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9dbaa3dffdbc156936656131874c3454e8bb1e64",
  },
  abilities: [
    {
      id: "17r-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "LET'S GET THIS SHOW ON THE ROAD {E} — Chosen character gains Rush this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dragon"],
};
