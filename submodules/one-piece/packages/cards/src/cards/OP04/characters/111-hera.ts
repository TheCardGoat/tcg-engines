import type { CharacterCard } from "@tcg/op-types";
import { op04Hera111I18n } from "./111-hera.i18n.ts";

export const op04Hera111: CharacterCard = {
  id: "OP04-111",
  canonicalId: "OP04-111",
  slug: "hera/op04-111",
  name: "Hera",
  printings: [
    {
      id: "OP04-111",
      artId: "OP04-111",
      setCode: "OP04",
      collectorNumber: "111",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-111.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP04",
  cost: 5,
  power: 3000,
  counter: 1000,
  traits: ["Big Mom Pirates Homies"],
  attribute: "special",
  effect:
    "[Activate:Main] You may trash 1 of your [Homies] type Characters other than this Character and rest this Character: Set up to 1 of your [Charlotte Linlin] Characters as active. [Trigger] Play this card.",
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
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Charlotte Linlin",
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op04Hera111I18n,
};
