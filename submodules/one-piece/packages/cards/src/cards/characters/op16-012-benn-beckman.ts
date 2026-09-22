import type { CharacterCard } from "@tcg/op-types";
import { op16BennBeckman012I18n } from "./op16-012-benn-beckman.i18n.ts";

export const op16BennBeckman012: CharacterCard = {
  id: "OP16-012",
  canonicalId: "OP16-012",
  slug: "benn-beckman/op16-012",
  name: "Benn.Beckman",
  printings: [
    {
      id: "OP16-012",
      artId: "OP16-012",
      setCode: "OP16",
      collectorNumber: "012",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-012_SflylJE.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP16",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  effect:
    "[Blocker] [On Play] You may rest 1 of your DON!! cards: If your Leader has the {Red-Haired Pirates} type and you have 10 DON!! cards on your field, play up to 1 [Shanks] from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Red-Haired Pirates",
          },
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 10,
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
                filter: "name",
                value: "Shanks",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op16BennBeckman012I18n,
};
