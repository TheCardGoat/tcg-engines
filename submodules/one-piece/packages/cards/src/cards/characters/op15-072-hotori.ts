import type { CharacterCard } from "@tcg/op-types";
import { op15Hotori072I18n } from "./op15-072-hotori.i18n.ts";

export const op15Hotori072: CharacterCard = {
  id: "OP15-072",
  canonicalId: "OP15-072",
  slug: "hotori/op15-072",
  name: "Hotori",
  printings: [
    {
      id: "OP15-072",
      artId: "OP15-072",
      setCode: "OP15",
      collectorNumber: "072",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-072_XRudesu.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "special",
  effect:
    "[Activate: Main] DON!! 2, You may rest this Character: If you have [Kotori] and [Satori], give up to 1 of your opponent's Characters 3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        optional: true,
        costs: [
          {
            cost: "restDon",
            amount: 2,
          },
          {
            cost: "restThisCard",
          },
        ],
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [{ filter: "name", value: "Kotori" }],
          },
          {
            condition: "hasCard",
            player: "self",
            zone: "character",
            filters: [{ filter: "name", value: "Satori" }],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op15Hotori072I18n,
};
