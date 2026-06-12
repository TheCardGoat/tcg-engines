import type { EventCard } from "@tcg/op-types";
import { op12IceBlockPheasantPeck057I18n } from "./057-ice-block-pheasant-peck.i18n.ts";

export const op12IceBlockPheasantPeck057: EventCard = {
  id: "OP12-057",
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
    ],
  },
  i18n: op12IceBlockPheasantPeck057I18n,
};
