import type { EventCard } from "@tcg/op-types";
import { op12ColorOfArmsHaki019I18n } from "./op12-019-color-of-arms-haki.i18n.ts";

export const op12ColorOfArmsHaki019: EventCard = {
  id: "OP12-019",
  canonicalId: "OP12-019",
  slug: "color-of-arms-haki/op12-019",
  name: "Color of Arms Haki",
  printings: [
    {
      id: "OP12-019",
      artId: "OP12-019",
      setCode: "OP12",
      collectorNumber: "019",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-019_uT5oPbh.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP12",
  cost: 0,
  traits: ["Former Roger Pirates"],
  effect:
    "[Main] You may give 1 active DON!! card to 1 of your [Silvers Rayleigh]: Up to 1 of your Leader or Character cards gains +1000 power during this turn.\n[Counter] Up to 1 of your Characters or [Silvers Rayleigh] gains +2000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "giveDon",
            amount: 1,
          },
        ],
        optional: true,
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "counter",
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
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op12ColorOfArmsHaki019I18n,
};
