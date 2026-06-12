import type { EventCard } from "@tcg/op-types";
import { op08BurnBazooka116I18n } from "./116-burn-bazooka.i18n.ts";

export const op08BurnBazooka116: EventCard = {
  id: "OP08-116",
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP08",
  cost: 2,
  traits: ["Sky Island Shandian Warrior"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, you may add 1 card from the top or bottom of your Life cards to your hand. If you do, add up to 1 [Shandian Warrior] type card from your hand to the top of your Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
      },
    ],
  },
  i18n: op08BurnBazooka116I18n,
};
