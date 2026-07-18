import type { EventCard } from "@tcg/op-types";
import { op13MeteorFist020I18n } from "./020-meteor-fist.i18n.ts";

export const op13MeteorFist020: EventCard = {
  id: "OP13-020",
  canonicalId: "OP13-020",
  slug: "meteor-fist",
  name: "Meteor Fist",
  printings: [
    {
      id: "OP13-020",
      artId: "OP13-020",
      setCode: "OP13",
      collectorNumber: "020",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-020_3lFUhF1.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP13",
  cost: 3,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Navy"],
  effect: "[Main] Give up to 1 of your opponent's Characters −5000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
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
            value: -5000,
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
  i18n: op13MeteorFist020I18n,
};
