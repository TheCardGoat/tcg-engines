import type { LeaderCard } from "@tcg/op-types";
import { op11Nami041I18n } from "./041-nami.i18n.ts";

export const op11Nami041: LeaderCard = {
  id: "OP11-041",
  cardType: "leader",
  color: ["blue", "yellow"],
  rarity: "L",
  setId: "OP11",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-041_p1.jpg",
      imageId: "OP11-041_p1",
    },
  ],
  effect:
    "[Your Turn] [Once Per Turn] This effect can be activated when a card is removed from your or your opponent's Life cards. If you have 7 or less cards in your hand, draw 1 card.[DON!! x1] [On Your Opponent's Attack] [Once Per Turn] You may trash 1 card from your hand: This Leader gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenLifeRemoved",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
      {
        trigger: "onOpponentAttack",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Nami041I18n,
};
