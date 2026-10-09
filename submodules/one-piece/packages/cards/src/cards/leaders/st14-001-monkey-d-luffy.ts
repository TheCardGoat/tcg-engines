import type { LeaderCard } from "@tcg/op-types";
import { st14MonkeyDLuffy001I18n } from "./st14-001-monkey-d-luffy.i18n.ts";
export const st14MonkeyDLuffy001: LeaderCard = {
  id: "ST14-001",
  canonicalId: "ST14-001",
  slug: "monkey-d-luffy/st14-001",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "ST14-001",
      artId: "ST14-001",
      setCode: "ST14",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST14-001.png",
    },
  ],
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "ST14",
  life: 5,
  traits: ["Straw Hat Crew"],
  power: 5000,
  attribute: "strike",
  effect:
    "[DON!! x1] All of your Characters gain +1 cost. If you have a Character with a cost of 8 or more, this Leader gains +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: 1,
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: "all",
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
            condition: {
              condition: "hasCard",
              player: "self",
              zone: "character",
              filters: [
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 8,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st14MonkeyDLuffy001I18n,
};
