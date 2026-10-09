import type { EventCard } from "@tcg/op-types";
import { st11IMInvincible005I18n } from "./st11-005-i-m-invincible.i18n.ts";
export const st11IMInvincible005: EventCard = {
  id: "ST11-005",
  canonicalId: "ST11-005",
  slug: "i-m-invincible/st11-005",
  name: "I'm invincible",
  printings: [
    {
      id: "ST11-005",
      artId: "ST11-005",
      setCode: "ST11",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST11-005.png",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "ST11",
  traits: ["Music", "FILM"],
  cost: 3,
  effect: "[Main] Set up to 1 of your [Uta] Leader as active.",
  trigger: "Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Uta",
                },
              ],
            },
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
  i18n: st11IMInvincible005I18n,
};
