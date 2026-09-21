import type { CharacterCard } from "@tcg/op-types";
import { op15Nami086I18n } from "./op15-086-nami.i18n.ts";

export const op15Nami086: CharacterCard = {
  id: "OP15-086",
  canonicalId: "OP15-086",
  slug: "nami/op15-086",
  name: "Nami",
  printings: [
    {
      id: "OP15-086",
      artId: "OP15-086",
      setCode: "OP15",
      collectorNumber: "086",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-086_vHGEGK0.jpg",
      label: "Nami (OP15-086)",
    },
    {
      id: "OP15-086_p1",
      artId: "OP15-086_p1",
      setCode: "OP15",
      collectorNumber: "086",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-086_p1_QKCr0Th.jpg",
      label: "Nami (OP15-086) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP15",
  cost: 8,
  power: 6000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the {Straw Hat Crew} type, play up to 1 {Straw Hat Crew} type Character with a cost of 7 or less from your trash. The Character played with this effect gains [Rush] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Straw Hat Crew",
            match: "includes",
          },
        ],
        actions: [
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
                filter: "trait",
                value: "Straw Hat Crew",
                match: "includes",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 7,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            thenActions: [
              {
                action: "grantKeyword",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: {
                    amount: 1,
                  },
                },
                keyword: "rush",
                duration: "thisTurn",
                previousActionTargets: true,
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op15Nami086I18n,
};
