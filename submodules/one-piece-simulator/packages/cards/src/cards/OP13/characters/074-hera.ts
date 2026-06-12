import type { CharacterCard } from "@tcg/op-types";
import { op13Hera074I18n } from "./074-hera.i18n.ts";

export const op13Hera074: CharacterCard = {
  id: "OP13-074",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP13",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates Homies"],
  attribute: "special",
  effect:
    "[On Play] Play up to 1 [Homies] type Character card with 3000 power or less from your hand.",
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
                filter: "power",
                comparison: "lte",
                value: 3000,
              },
              {
                filter: "trait",
                value: "Homies",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op13Hera074I18n,
};
