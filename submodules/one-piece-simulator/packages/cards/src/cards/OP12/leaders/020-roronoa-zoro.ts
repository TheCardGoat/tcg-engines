import type { LeaderCard } from "@tcg/op-types";
import { op12RoronoaZoro020I18n } from "./020-roronoa-zoro.i18n.ts";

export const op12RoronoaZoro020: LeaderCard = {
  id: "OP12-020",
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP12",
  power: 5000,
  life: 5,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-020_p1_jkzz1zC.jpg",
      imageId: "OP12-020_p1",
    },
  ],
  effect:
    "[DON!! x3] [Activate: Main] [Once Per Turn] If this Leader battles your opponent's Character during this turn, set this Leader as active. Then, this Leader cannot attack your opponent's Characters with a base cost of 7 or less during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "donAttached",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
          {
            action: "cannotAttack",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12RoronoaZoro020I18n,
};
