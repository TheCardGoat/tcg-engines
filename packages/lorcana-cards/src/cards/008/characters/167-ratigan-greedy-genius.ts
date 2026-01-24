import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganGreedyGenius: CharacterCard = {
  id: "e9z",
  cardType: "character",
  name: "Ratigan",
  version: "Greedy Genius",
  fullName: "Ratigan - Greedy Genius",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "008",
  text: "Ward (Opponents can't choose this character except to challenge.)\nTIME RUNS OUT At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
  cost: 8,
  strength: 6,
  willpower: 7,
  lore: 4,
  cardNumber: 167,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "33748d6ee65b52b4bdc850aff7d2e12b9ce0276c",
  },
  abilities: [
    {
      id: "e9z-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "e9z-2",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you didn't put any cards into your inkwell this turn",
        },
        then: {
          type: "banish",
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "TIME RUNS OUT At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
