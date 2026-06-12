import type { ActionCard } from "@tcg/lorcana-types";
import { searchForCluesI18n } from "./026-search-for-clues.i18n";

export const searchForClues: ActionCard = {
  id: "imz",
  canonicalId: "ci_imz",
  reprints: ["set10-026"],
  cardType: "action",
  name: "Search for Clues",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 26,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_3945ef0eb7ba41b8b1c9382bf3380579",
    tcgPlayer: 658337,
  },
  text: "The player or players with the most cards in their hands choose and discard 2 cards. If you have a Detective character in play, gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "discard",
            amount: 2,
            chosen: true,
            from: "hand",
            target: {
              selector: "each-player",
              filter: {
                type: "zone-count-rank",
                zone: "hand",
                rank: "highest",
                ties: "all",
                minCount: 1,
              },
            },
          },
          {
            type: "conditional",
            condition: {
              type: "target-query",
              query: {
                selector: "all",
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filters: [
                  {
                    type: "has-classification",
                    classification: "Detective",
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            then: {
              type: "gain-lore",
              amount: 1,
              target: "CONTROLLER",
            },
          },
        ],
      },
    },
  ],
  i18n: searchForCluesI18n,
};
