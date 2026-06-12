import type { CharacterCard } from "@tcg/op-types";
import { op13BoaSandersonia050I18n } from "./050-boa-sandersonia.i18n.ts";

export const op13BoaSandersonia050: CharacterCard = {
  id: "OP13-050",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Kuja Pirates"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader is [Boa Hancock], play up to 1 [Boa Hancock] with a cost of 3 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Boa Hancock",
          },
        ],
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
                value: 3,
              },
              {
                filter: "name",
                value: "Boa Hancock",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op13BoaSandersonia050I18n,
};
