import type { CharacterCard } from "@tcg/op-types";
import { op02Fullbody111I18n } from "./111-fullbody.i18n.ts";

export const op02Fullbody111: CharacterCard = {
  id: "OP02-111",
  canonicalId: "OP02-111",
  slug: "fullbody/op02-111",
  name: "Fullbody",
  printings: [
    {
      id: "OP02-111",
      artId: "OP02-111",
      setCode: "OP02",
      collectorNumber: "111",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-111.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "strike",
  effect: "[When Attacking] If you have [Jango], this card gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Jango",
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op02Fullbody111I18n,
};
