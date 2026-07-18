import type { CharacterCard } from "@tcg/op-types";
import { op09Wire017I18n } from "./017-wire.i18n.ts";

export const op09Wire017: CharacterCard = {
  id: "OP09-017",
  canonicalId: "OP09-017",
  slug: "wire/op09-017",
  name: "Wire",
  printings: [
    {
      id: "OP09-017",
      artId: "OP09-017",
      setCode: "OP09",
      collectorNumber: "017",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-017.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP09",
  cost: 4,
  power: 4000,
  counter: 2000,
  traits: ["Kid Pirates"],
  attribute: "slash",
  effect:
    '[DON!! x1] If your Leader has 7000 power or more and the "Kid Pirates" type, this Character gains [Rush].',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "hasCard",
                player: "self",
                zone: "leader",
                filters: [
                  {
                    filter: "power",
                    comparison: "gte",
                    value: 7000,
                  },
                ],
              },
              {
                condition: "leaderTrait",
                trait: "Kid Pirates",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op09Wire017I18n,
};
