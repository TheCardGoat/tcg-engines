import type { CharacterCard } from "@tcg/op-types";
import { op13York094I18n } from "./094-york.i18n.ts";

export const op13York094: CharacterCard = {
  id: "OP13-094",
  canonicalId: "OP13-094",
  slug: "york/op13-094",
  name: "York",
  printings: [
    {
      id: "OP13-094",
      artId: "OP13-094",
      setCode: "OP13",
      collectorNumber: "094",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-094_xsMhQ1k.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP13",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Scientist Egghead"],
  attribute: "wisdom",
  effect:
    '[On Play] Up to 1 of your "Celestial Dragons" type Characters gains +2000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Celestial Dragons",
                  match: "includes",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13York094I18n,
};
