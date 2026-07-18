import type { CharacterCard } from "@tcg/op-types";
import { op01Jinbe071I18n } from "./071-jinbe.i18n.ts";

export const op01Jinbe071: CharacterCard = {
  id: "OP01-071",
  canonicalId: "OP01-071",
  slug: "jinbe/op01-071",
  name: "Jinbe",
  printings: [
    {
      id: "OP01-071",
      artId: "OP01-071",
      setCode: "OP01",
      collectorNumber: "071",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-071.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP01",
  cost: 4,
  power: 2000,
  traits: ["Fish-Man Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Place up to 1 Character with a cost of 3 or less at the bottom of the owner's deck. [Trigger] Play this card.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "any",
              zones: ["character"],
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
              ],
            },
            position: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
            self: true,
          },
        ],
      },
    ],
  },
  i18n: op01Jinbe071I18n,
};
