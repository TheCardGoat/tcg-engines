import type { LeaderCard } from "@tcg/op-types";
import { st12RoronoaZoroSanji001I18n } from "./st12-001-roronoa-zoro-sanji.i18n.ts";
export const st12RoronoaZoroSanji001: LeaderCard = {
  id: "ST12-001",
  canonicalId: "ST12-001",
  slug: "roronoa-zoro-sanji/st12-001",
  name: "Roronoa Zoro & Sanji",
  printings: [
    {
      id: "ST12-001",
      artId: "ST12-001",
      setCode: "ST12",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST12-001.png",
    },
  ],
  cardType: "leader",
  color: ["green", "blue"],
  rarity: "L",
  setId: "ST12",
  life: 4,
  traits: ["Straw Hat Crew"],
  power: 5000,
  attribute: ["slash", "strike"],
  effect:
    "[DON!! x1] [When Attacking] [Once Per Turn] You may return 1 of your Characters with a cost of 2 or more to the owner's hand: Set up to 1 of your Characters with 7000 power or less as active.",
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
        costs: [
          {
            cost: "returnCharacter",
            amount: 1,
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 2,
              },
            ],
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
                  filter: "power",
                  comparison: "lte",
                  value: 7000,
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st12RoronoaZoroSanji001I18n,
};
