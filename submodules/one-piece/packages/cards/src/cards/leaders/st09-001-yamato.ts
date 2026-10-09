import type { LeaderCard } from "@tcg/op-types";
import { st09Yamato001I18n } from "./st09-001-yamato.i18n.ts";
export const st09Yamato001: LeaderCard = {
  id: "ST09-001",
  canonicalId: "ST09-001",
  slug: "yamato/st09-001",
  name: "Yamato",
  printings: [
    {
      id: "ST09-001",
      artId: "ST09-001",
      setCode: "ST09",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-001.png",
    },
  ],
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "ST09",
  life: 5,
  traits: ["Land of Wano"],
  power: 5000,
  attribute: "strike",
  effect:
    "[DON!! x1] [Opponent's Turn] If you have 2 or less Life cards, this Leader gains +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
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
          },
        ],
      },
    ],
  },
  i18n: st09Yamato001I18n,
};
