import type { EventCard } from "@tcg/op-types";
import { st10GumGumGiantSumoSlap015I18n } from "./st10-015-gum-gum-giant-sumo-slap.i18n.ts";
export const st10GumGumGiantSumoSlap015: EventCard = {
  id: "ST10-015",
  canonicalId: "ST10-015",
  slug: "gum-gum-giant-sumo-slap/st10-015",
  name: "Gum-Gum Giant Sumo Slap",
  printings: [
    {
      id: "ST10-015",
      artId: "ST10-015",
      setCode: "ST10",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-015.png",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "C",
  setId: "ST10",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle, and K.O. up to 1 of your opponent's Characters with 2000 power or less.",
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
            value: 2000,
            duration: "thisBattle",
          },
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
                  value: 2000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st10GumGumGiantSumoSlap015I18n,
};
