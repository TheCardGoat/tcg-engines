import type { ActionCard } from "@tcg/lorcana-types";
import { theBossIsOnARollI18n } from "./063-the-boss-is-on-a-roll.i18n";

export const theBossIsOnARoll: ActionCard = {
  id: "rx8",
  canonicalId: "ci_rx8",
  reprints: ["set3-063"],
  cardType: "action",
  name: "The Boss is on a Roll",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "003",
  cardNumber: 63,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_716a89f3b6cf4f57b66888fd4166d1df",
    tcgPlayer: 537633,
  },
  text: "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 5,
            target: "CONTROLLER",
            type: "scry",
            destinations: [
              {
                zone: "deck-top",
                max: 5,
                ordering: "player-choice",
              },
              {
                zone: "deck-bottom",
                max: 5,
                remainder: true,
                ordering: "player-choice",
              },
            ],
          },
          {
            amount: 1,
            type: "gain-lore",
          },
        ],
      },
      type: "action",
    },
  ],
  i18n: theBossIsOnARollI18n,
};
