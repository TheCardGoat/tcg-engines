import type { CharacterCard } from "@tcg/op-types";
import { eb02Sarfunkel014I18n } from "./014-sarfunkel.i18n.ts";

export const eb02Sarfunkel014: CharacterCard = {
  id: "EB02-014",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB02",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect: "[On Play] Play up to 1 [Gaimon] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Gaimon",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb02Sarfunkel014I18n,
};
