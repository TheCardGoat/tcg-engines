import type { CharacterCard } from "@tcg/op-types";
import { op16Buggy048I18n } from "./op16-048-buggy.i18n.ts";

export const op16Buggy048: CharacterCard = {
  id: "OP16-048",
  canonicalId: "OP16-048",
  slug: "buggy/op16-048",
  name: "Buggy",
  printings: [
    {
      id: "OP16-048",
      artId: "OP16-048",
      setCode: "OP16",
      collectorNumber: "048",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-048_a9oGJRL.jpg",
      label: "Buggy (048)",
    },
    {
      id: "OP16-048_p1",
      artId: "OP16-048_p1",
      setCode: "OP16",
      collectorNumber: "048",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-048_p1_XrgdosL.jpg",
      label: "Buggy (048) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP16",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Buggy Pirates Impel Down"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader has the {Impel Down} type, draw 1 card and play up to 1 [Prisoner of Impel Down] card from your hand. [Once Per Turn] This effect can be activated when your opponent attacks. Up to 1 of your [Prisoner of Impel Down] cards gains [Blocker] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Impel Down",
            match: "includes",
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
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Prisoner of Impel Down",
              },
            ],
          },
        ],
      },
      {
        trigger: "onOpponentAttack",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Prisoner of Impel Down",
                },
              ],
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op16Buggy048I18n,
};
