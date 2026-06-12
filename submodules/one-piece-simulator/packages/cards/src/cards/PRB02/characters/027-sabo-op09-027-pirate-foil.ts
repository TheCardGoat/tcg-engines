import type { CharacterCard } from "@tcg/op-types";
import { prb02SaboOp09027PirateFoil027I18n } from "./027-sabo-op09-027-pirate-foil.i18n.ts";

export const prb02SaboOp09027PirateFoil027: CharacterCard = {
  id: "OP09-027",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Revolutionary Army ODYSSEY"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-027_r1.jpg",
      imageId: "OP09-027_r1",
    },
  ],
  effect: "[When Attacking] [Once Per Turn] If you have 3 or more rested Characters, draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 3,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02SaboOp09027PirateFoil027I18n,
};
