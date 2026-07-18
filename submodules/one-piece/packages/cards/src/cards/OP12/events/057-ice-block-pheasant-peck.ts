import type { EventCard } from "@tcg/op-types";
import { op12IceBlockPheasantPeck057I18n } from "./057-ice-block-pheasant-peck.i18n.ts";

export const op12IceBlockPheasantPeck057: EventCard = {
  id: "OP12-057",
  canonicalId: "OP12-057",
  slug: "ice-block-pheasant-peck",
  name: "Ice Block Pheasant Peck",
  printings: [
    {
      id: "OP12-057",
      artId: "OP12-057",
      setCode: "OP12",
      collectorNumber: "057",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-057_T9tmHBg.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  trigger: "You may trash 1 card from your hand: Draw 1 card.",
  traits: ["Navy"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "counter",
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
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op12IceBlockPheasantPeck057I18n,
};
