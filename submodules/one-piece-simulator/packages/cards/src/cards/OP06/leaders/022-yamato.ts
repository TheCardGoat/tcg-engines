import type { LeaderCard } from "@tcg/op-types";
import { op06Yamato022I18n } from "./022-yamato.i18n.ts";

export const op06Yamato022: LeaderCard = {
  id: "OP06-022",
  cardType: "leader",
  color: ["green", "yellow"],
  rarity: "L",
  setId: "OP06",
  power: 5000,
  life: 4,
  traits: ["Land of Wano"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-022_p1.jpg",
      imageId: "OP06-022_p1",
    },
  ],
  effect:
    "[Double Attack] (This card deals 2 damage.)\n[Activate:Main] [Once Per Turn] If your opponent has 3 or less Life cards, give up to 2 rested DON!! cards to 1 of your Characters.",
  effects: {
    keywords: ["doubleAttack"],
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "lifeCount",
            player: "opponent",
            comparison: "lte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op06Yamato022I18n,
};
