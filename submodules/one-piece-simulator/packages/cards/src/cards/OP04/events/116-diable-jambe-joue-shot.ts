import type { EventCard } from "@tcg/op-types";
import { op04DiableJambeJoueShot116I18n } from "./116-diable-jambe-joue-shot.i18n.ts";

export const op04DiableJambeJoueShot116: EventCard = {
  id: "OP04-116",
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  traits: ["The Vinsmoke Family"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +6000 power during this battle. Then, if you and your opponent have a total of 4 or less Life cards, K.O. up to 1 of your opponent's Characters with a cost of 2 or less. [Trigger] Draw 1 card.",
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
            value: 6000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op04DiableJambeJoueShot116I18n,
};
