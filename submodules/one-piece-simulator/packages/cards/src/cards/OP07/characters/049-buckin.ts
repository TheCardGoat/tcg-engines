import type { CharacterCard } from "@tcg/op-types";
import { op07Buckin049I18n } from "./049-buckin.i18n.ts";

export const op07Buckin049: CharacterCard = {
  id: "OP07-049",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 0,
  traits: ["Weevil's Mother"],
  attribute: "wisdom",
  effect: "[On Play] Play up to 1 [Edward Weevil] with a cost of 4 or less from your hand rested.",
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
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "name",
                value: "Edward Weevil",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op07Buckin049I18n,
};
