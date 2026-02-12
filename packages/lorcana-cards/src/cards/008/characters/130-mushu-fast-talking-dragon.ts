import type { CharacterCard } from "@tcg/lorcana-types";

export const mushuFasttalkingDragon: CharacterCard = {
  abilities: [
    {
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
      id: "17r-1",
      text: "LET'S GET THIS SHOW ON THE ROAD {E} — Chosen character gains Rush this turn.",
      type: "activated",
    },
  ],
  cardNumber: 130,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Dragon"],
  cost: 3,
  externalIds: {
    ravensburger: "9dbaa3dffdbc156936656131874c3454e8bb1e64",
  },
  franchise: "Mulan",
  fullName: "Mushu - Fast-Talking Dragon",
  id: "17r",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mushu",
  set: "008",
  strength: 2,
  text: "LET'S GET THIS SHOW ON THE ROAD {E} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  version: "Fast-Talking Dragon",
  willpower: 3,
};
