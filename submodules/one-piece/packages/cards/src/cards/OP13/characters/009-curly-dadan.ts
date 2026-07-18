import type { CharacterCard } from "@tcg/op-types";
import { op13CurlyDadan009I18n } from "./009-curly-dadan.i18n.ts";

export const op13CurlyDadan009: CharacterCard = {
  id: "OP13-009",
  canonicalId: "OP13-009",
  slug: "curly-dadan/op13-009",
  name: "Curly.Dadan",
  printings: [
    {
      id: "OP13-009",
      artId: "OP13-009",
      setCode: "OP13",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-009_WWKMdip.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Mountain Bandits Mountain Bandits"],
  attribute: "slash",
  effect:
    'If you have a "Mountain Bandits" type Character other than this card, this Character gains [Double Attack].',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [
              {
                filter: "trait",
                value: "Mountain Bandits",
                match: "includes",
              },
              {
                filter: "excludeSelf",
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
            keyword: "doubleAttack",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op13CurlyDadan009I18n,
};
