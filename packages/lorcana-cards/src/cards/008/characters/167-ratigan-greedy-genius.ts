import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganGreedyGenius: CharacterCard = {
  abilities: [
    {
      id: "e9z-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
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
      id: "e9z-2",
      text: "TIME RUNS OUT At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
      type: "action",
    },
  ],
  cardNumber: 167,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 8,
  externalIds: {
    ravensburger: "33748d6ee65b52b4bdc850aff7d2e12b9ce0276c",
  },
  franchise: "Great Mouse Detective",
  fullName: "Ratigan - Greedy Genius",
  id: "e9z",
  inkType: ["sapphire"],
  inkable: true,
  lore: 4,
  missingTests: true,
  name: "Ratigan",
  set: "008",
  strength: 6,
  text: "Ward (Opponents can't choose this character except to challenge.)\nTIME RUNS OUT At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
  version: "Greedy Genius",
  willpower: 7,
};
