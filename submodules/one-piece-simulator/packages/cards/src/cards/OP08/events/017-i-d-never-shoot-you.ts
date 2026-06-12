import type { EventCard } from "@tcg/op-types";
import { op08IDNeverShootYou017I18n } from "./017-i-d-never-shoot-you.i18n.ts";

export const op08IDNeverShootYou017: EventCard = {
  id: "OP08-017",
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "OP08",
  cost: 2,
  traits: ["Drum Kingdom"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, give up to 1 of your opponent's Leader or Character cards 1000 power during this turn. [Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op08IDNeverShootYou017I18n,
};
