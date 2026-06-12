import type { EventCard } from "@tcg/op-types";
import { op14eb04BulletString078I18n } from "./078-bullet-string.i18n.ts";

export const op14eb04BulletString078: EventCard = {
  id: "OP14-078",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  effect:
    "[Counter] DON!! 1: If your Leader has the {Donquixote Pirates} type, up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, that card gains an additional +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Donquixote Pirates",
          },
        ],
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op14eb04BulletString078I18n,
};
