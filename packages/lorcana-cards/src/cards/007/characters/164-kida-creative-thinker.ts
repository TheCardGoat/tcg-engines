import type { CharacterCard } from "@tcg/lorcana-types";

export const kidaCreativeThinker: CharacterCard = {
  abilities: [
    {
      id: "13v-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
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
      id: "13v-2",
      text: "KEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.",
      type: "action",
    },
  ],
  cardNumber: 164,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "8fc0d0ceafd51fa5b52595a8a1b5f6817fadb9f1",
  },
  franchise: "Atlantis",
  fullName: "Kida - Creative Thinker",
  id: "13v",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Kida",
  set: "007",
  strength: 3,
  text: "Ward (Opponents can't choose this character except to challenge.)\nKEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.",
  version: "Creative Thinker",
  willpower: 3,
};
