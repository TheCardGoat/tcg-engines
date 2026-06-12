import type { EventCard } from "@tcg/op-types";
import { op04EnchantingVertigoDance018I18n } from "./018-enchanting-vertigo-dance.i18n.ts";

export const op04EnchantingVertigoDance018: EventCard = {
  id: "OP04-018",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  traits: ["Alabasta"],
  effect:
    "[Main] If your Leader has the [Alabasta] type, give up to 2 of your opponent's Characters -2000 power during this turn. [Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Alabasta",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op04EnchantingVertigoDance018I18n,
};
