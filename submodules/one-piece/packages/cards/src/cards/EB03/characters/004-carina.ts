import type { CharacterCard } from "@tcg/op-types";
import { eb03Carina004I18n } from "./004-carina.i18n.ts";

export const eb03Carina004: CharacterCard = {
  id: "EB03-004",
  canonicalId: "EB03-004",
  slug: "carina/eb03-004",
  name: "Carina",
  printings: [
    {
      id: "EB03-004",
      artId: "EB03-004",
      setCode: "EB03",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-004_DWHgzDZ.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB03",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["FILM Grantesoro"],
  attribute: "wisdom",
  effect:
    "[Blocker]\n[Opponent's Turn] If your Leader is multicolored and you have no Characters with 6000 base power or more, this Character gains +4000 power.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderMulticolored",
              },
              {
                condition: "notHasCard",
                player: "self",
                zone: "character",
                filters: [
                  {
                    filter: "basePower",
                    comparison: "gte",
                    value: 6000,
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 4000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb03Carina004I18n,
};
