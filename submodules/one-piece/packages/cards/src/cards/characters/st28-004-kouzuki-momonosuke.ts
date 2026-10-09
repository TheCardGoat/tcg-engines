import type { CharacterCard } from "@tcg/op-types";
import { st28KouzukiMomonosuke004I18n } from "./st28-004-kouzuki-momonosuke.i18n.ts";
export const st28KouzukiMomonosuke004: CharacterCard = {
  id: "ST28-004",
  canonicalId: "ST28-004",
  slug: "kouzuki-momonosuke/st28-004",
  name: "Kouzuki Momonosuke",
  printings: [
    {
      id: "ST28-004",
      artId: "ST28-004",
      setCode: "ST28",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST28-004.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST28",
  cost: 6,
  traits: ["Land of Wano", "Kouzuki Clan"],
  power: 7000,
  attribute: "slash",
  effect:
    "[Your Turn] If you have 2 or less Life cards, your Leader gains +1000 power. [Activate: Main] [Once Per Turn] You may return 2 total of your currently given DON!! cards to your cost area rested: This Character gains [Rush] and +1000 power during this turn. (This card can attack on the turn in which it is played.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
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
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
    effects: [
      {
        trigger: "activateMain",
        optional: true,
        oncePerTurn: true,
        costs: [
          {
            cost: "returnDon",
            amount: 2,
            donState: "attached",
            destination: "costAreaRested",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st28KouzukiMomonosuke004I18n,
};
