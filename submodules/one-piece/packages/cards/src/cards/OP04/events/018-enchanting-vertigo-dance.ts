import type { EventCard } from "@tcg/op-types";
import { op04EnchantingVertigoDance018I18n } from "./018-enchanting-vertigo-dance.i18n.ts";

export const op04EnchantingVertigoDance018: EventCard = {
  id: "OP04-018",
  canonicalId: "OP04-018",
  slug: "enchanting-vertigo-dance",
  name: "Enchanting Vertigo Dance",
  printings: [
    {
      id: "OP04-018",
      artId: "OP04-018",
      setCode: "OP04",
      collectorNumber: "018",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-018.jpg",
    },
  ],
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
