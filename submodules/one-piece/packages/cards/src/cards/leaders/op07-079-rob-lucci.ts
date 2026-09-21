import type { LeaderCard } from "@tcg/op-types";
import { op07RobLucci079I18n } from "./op07-079-rob-lucci.i18n.ts";

export const op07RobLucci079: LeaderCard = {
  id: "OP07-079",
  canonicalId: "OP07-079",
  slug: "rob-lucci/op07-079",
  name: "Rob Lucci",
  printings: [
    {
      id: "OP07-079",
      artId: "OP07-079",
      setCode: "OP07",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-079.jpg",
    },
    {
      id: "OP07-079_p1",
      artId: "OP07-079_p1",
      setCode: "OP07",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-079_p1.jpg",
    },
    {
      id: "OP07-079_p2",
      artId: "OP07-079_p2",
      setCode: "OP07",
      collectorNumber: "079",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-079_p2.jpg",
      label: "Rob Lucci (SPR)",
    },
  ],
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "OP07",
  power: 5000,
  life: 5,
  traits: ["CP0"],
  attribute: "strike",

  effect:
    "[When Attacking] You may trash 2 cards from the top of your deck: Give up to 1 of your opponent's Characters -1 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "deck",
            comparison: "gte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07RobLucci079I18n,
};
