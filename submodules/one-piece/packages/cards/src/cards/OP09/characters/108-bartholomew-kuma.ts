import type { CharacterCard } from "@tcg/op-types";
import { op09BartholomewKuma108I18n } from "./108-bartholomew-kuma.i18n.ts";

export const op09BartholomewKuma108: CharacterCard = {
  id: "OP09-108",
  canonicalId: "OP09-108",
  slug: "bartholomew-kuma/op09-108",
  name: "Bartholomew Kuma",
  printings: [
    {
      id: "OP09-108",
      artId: "OP09-108",
      setCode: "OP09",
      collectorNumber: "108",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-108.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 2000,
  trigger:
    'If your Leader has the "Revolutionary Army" type and you and your opponent have a total of 5 or less Life cards, play this card.',
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  attribute: "strike",
  effect:
    '[Trigger] If your Leader has the "Revolutionary Army" type and you and your opponent have a total of 5 or less Life cards, play this card.',
  effects: {
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Revolutionary Army",
                match: "includes",
              },
              {
                condition: "totalLifeCount",
                comparison: "lte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op09BartholomewKuma108I18n,
};
