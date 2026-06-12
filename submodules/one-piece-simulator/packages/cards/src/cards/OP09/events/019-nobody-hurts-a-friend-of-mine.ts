import type { EventCard } from "@tcg/op-types";
import { op09NobodyHurtsAFriendOfMine019I18n } from "./019-nobody-hurts-a-friend-of-mine.i18n.ts";

export const op09NobodyHurtsAFriendOfMine019: EventCard = {
  id: "OP09-019",
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
        ],
      },
    ],
  },
  i18n: op09NobodyHurtsAFriendOfMine019I18n,
};
