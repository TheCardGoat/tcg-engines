import type { CharacterCard } from "@tcg/op-types";
import { op12KuzanSp082I18n } from "./082-kuzan-sp.i18n.ts";

export const op12KuzanSp082: CharacterCard = {
  id: "OP10-082",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP12",
  cost: 5,
  power: 5000,
  traits: ["Blackbeard Pirates Former Navy"],
  attribute: "special",
  effect:
    'This Character cannot be removed from the field by your opponent\'s effects.\n[Activate: Main] You may trash this Character: Draw 1 card. Then, play up to 1 "Blackbeard Pirates" type Character card with a cost of 5 or less other than [Kuzan] from your trash.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "trash",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Kuzan",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "trait",
                value: "Blackbeard Pirates",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12KuzanSp082I18n,
};
