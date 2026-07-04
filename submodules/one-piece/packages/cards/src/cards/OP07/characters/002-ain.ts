import type { CharacterCard } from "@tcg/op-types";
import { op07Ain002I18n } from "./002-ain.i18n.ts";

export const op07Ain002: CharacterCard = {
  id: "OP07-002",
  canonicalId: "OP07-002",
  slug: "ain/op07-002",
  name: "Ain",
  printings: [
    {
      id: "OP07-002",
      artId: "OP07-002",
      setCode: "OP07",
      collectorNumber: "002",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-002.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP07",
  cost: 7,
  power: 6000,
  traits: ["FILM Neo Navy"],
  attribute: "special",
  effect: "[On Play] Set the power of up to 1 of your opponent's Characters to 0 during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 0,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op07Ain002I18n,
};
