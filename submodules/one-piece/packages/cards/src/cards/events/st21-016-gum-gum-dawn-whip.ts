import type { EventCard } from "@tcg/op-types";
import { st21GumGumDawnWhip016I18n } from "./st21-016-gum-gum-dawn-whip.i18n.ts";
export const st21GumGumDawnWhip016: EventCard = {
  id: "ST21-016",
  canonicalId: "ST21-016",
  slug: "gum-gum-dawn-whip/st21-016",
  name: "Gum-Gum Dawn Whip",
  printings: [
    {
      id: "ST21-016",
      artId: "ST21-016",
      setCode: "ST21",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST21-016.png",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST21",
  cost: 2,
  traits: ["The Four Emperors", "Straw Hat Crew"],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +1000 power during this turn. Then, up to 1 of your opponent's Characters with 4000 power or less cannot activate [Blocker] during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
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
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  trigger: "[Trigger] K.O. up to 1 of your opponent's Characters with 4000 power or less.",
  i18n: st21GumGumDawnWhip016I18n,
};
