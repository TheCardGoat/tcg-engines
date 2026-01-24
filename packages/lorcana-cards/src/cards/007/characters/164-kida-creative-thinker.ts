import type { CharacterCard } from "@tcg/lorcana-types";

export const kidaCreativeThinker: CharacterCard = {
  id: "13v",
  cardType: "character",
  name: "Kida",
  version: "Creative Thinker",
  fullName: "Kida - Creative Thinker",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "007",
  text: "Ward (Opponents can't choose this character except to challenge.)\nKEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 164,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8fc0d0ceafd51fa5b52595a8a1b5f6817fadb9f1",
  },
  abilities: [
    {
      id: "13v-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "13v-2",
      type: "action",
      effect: {
        type: "scry",
        amount: 2,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      text: "KEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
