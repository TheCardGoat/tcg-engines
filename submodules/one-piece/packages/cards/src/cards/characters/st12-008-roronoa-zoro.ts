import type { CharacterCard } from "@tcg/op-types";
import { st12RoronoaZoro008I18n } from "./st12-008-roronoa-zoro.i18n.ts";
export const st12RoronoaZoro008: CharacterCard = {
  id: "ST12-008",
  canonicalId: "ST12-008",
  slug: "roronoa-zoro/st12-008",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "ST12-008",
      artId: "ST12-008",
      setCode: "ST12",
      collectorNumber: "008",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST12-008.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST12",
  cost: 4,
  traits: ["Straw Hat Crew"],
  power: 6000,
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] Rest up to 1 of your opponent's Characters with a cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st12RoronoaZoro008I18n,
};
