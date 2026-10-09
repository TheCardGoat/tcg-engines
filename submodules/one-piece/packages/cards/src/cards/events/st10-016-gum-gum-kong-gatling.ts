import type { EventCard } from "@tcg/op-types";
import { st10GumGumKongGatling016I18n } from "./st10-016-gum-gum-kong-gatling.i18n.ts";
export const st10GumGumKongGatling016: EventCard = {
  id: "ST10-016",
  canonicalId: "ST10-016",
  slug: "gum-gum-kong-gatling/st10-016",
  name: "Gum-Gum Kong Gatling",
  printings: [
    {
      id: "ST10-016",
      artId: "ST10-016",
      setCode: "ST10",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-016.png",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST10",
  cost: 5,
  traits: ["Straw Hat Crew"],
  effect: "[Main] K.O. up to 1 of your opponent's Characters with 7000 power or less.",
  trigger: "Up to 1 of your Leader gains +1000 power until the end of your next turn.",
  effects: {
    effects: [
      {
        trigger: "main",
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
                  value: 7000,
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
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "untilEndOfYourNextTurn",
          },
        ],
      },
    ],
  },
  i18n: st10GumGumKongGatling016I18n,
};
