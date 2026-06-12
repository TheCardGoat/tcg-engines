import type { EventCard } from "@tcg/op-types";
import { op03IkokuSovereignty118I18n } from "./118-ikoku-sovereignty.i18n.ts";

export const op03IkokuSovereignty118: EventCard = {
  id: "OP03-118",
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP03",
  cost: 2,
  traits: ["The Four Emperors Big Mom Pirates"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +5000 power during this battle. [Trigger] You may trash 2 cards from your hand: Add up to 1 card from the top of your deck to the top of your Life cards.",
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
            value: 5000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03IkokuSovereignty118I18n,
};
