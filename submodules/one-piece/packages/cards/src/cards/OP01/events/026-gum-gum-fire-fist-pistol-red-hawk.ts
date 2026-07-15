import type { EventCard } from "@tcg/op-types";
import { op01GumGumFireFistPistolRedHawk026I18n } from "./026-gum-gum-fire-fist-pistol-red-hawk.i18n.ts";

export const op01GumGumFireFistPistolRedHawk026: EventCard = {
  id: "OP01-026",
  canonicalId: "OP01-026",
  slug: "gum-gum-fire-fist-pistol-red-hawk/op01-026",
  name: "Gum-Gum Fire-Fist Pistol Red Hawk",
  printings: [
    {
      id: "OP01-026",
      artId: "OP01-026",
      setCode: "OP01",
      collectorNumber: "026",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-026.jpg",
    },
  ],
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP01",
  cost: 2,
  traits: ["Straw Hat Crew Supernovas"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, K.O. up to 1 of your opponent's Characters with 4000 power or less. [Trigger] Give up to 1 of your opponent's Leader or Character cards -10000 power during this turn.  This card has been officially errata'd.",
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
      {
        trigger: "trigger",
        actions: [
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
            value: -10000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op01GumGumFireFistPistolRedHawk026I18n,
};
