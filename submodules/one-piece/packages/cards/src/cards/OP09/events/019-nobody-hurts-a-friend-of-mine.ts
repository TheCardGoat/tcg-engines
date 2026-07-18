import type { EventCard } from "@tcg/op-types";
import { op09NobodyHurtsAFriendOfMine019I18n } from "./019-nobody-hurts-a-friend-of-mine.i18n.ts";

export const op09NobodyHurtsAFriendOfMine019: EventCard = {
  id: "OP09-019",
  canonicalId: "OP09-019",
  slug: "nobody-hurts-a-friend-of-mine",
  name: "Nobody Hurts a Friend of Mine!!!!",
  printings: [
    {
      id: "OP09-019",
      artId: "OP09-019",
      setCode: "OP09",
      collectorNumber: "019",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-019.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  trigger: "Draw 1 card.",
  traits: ["Red-Haired Pirates"],
  effect:
    '[Main] If your Leader has the "Red-Haired Pirates" type, give up to 1 of your opponent\'s Characters -3000 power during this turn. Then, if your opponent has a Character with 5000 or more power, draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Red-Haired Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "existsOnField",
              player: "opponent",
              zone: "character",
              filters: [{ filter: "power", comparison: "gte", value: 5000 }],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
  i18n: op09NobodyHurtsAFriendOfMine019I18n,
};
