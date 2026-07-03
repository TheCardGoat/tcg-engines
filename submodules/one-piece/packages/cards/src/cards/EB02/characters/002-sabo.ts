import type { CharacterCard } from "@tcg/op-types";
import { eb02Sabo002I18n } from "./002-sabo.i18n.ts";

export const eb02Sabo002: CharacterCard = {
  id: "EB02-002",
  canonicalId: "EB02-002",
  slug: "sabo/eb02-002",
  name: "Sabo",
  printings: [
    {
      id: "EB02-002",
      artId: "EB02-002",
      setCode: "EB02",
      collectorNumber: "002",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-002.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "EB02",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  effect:
    '[Activate: Main] You may rest this Character: Up to 1 of your "Revolutionary Army" type Characters other than [Sabo] gains +2000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
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
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Revolutionary Army",
                },
                {
                  filter: "excludeName",
                  value: "Sabo",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb02Sabo002I18n,
};
