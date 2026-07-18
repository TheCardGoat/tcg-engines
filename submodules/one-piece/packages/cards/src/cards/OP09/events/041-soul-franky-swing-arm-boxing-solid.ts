import type { EventCard } from "@tcg/op-types";
import { op09SoulFrankySwingArmBoxingSolid041I18n } from "./041-soul-franky-swing-arm-boxing-solid.i18n.ts";

export const op09SoulFrankySwingArmBoxingSolid041: EventCard = {
  id: "OP09-041",
  canonicalId: "OP09-041",
  slug: "soul-franky-swing-arm-boxing-solid",
  name: "Soul Franky Swing Arm Boxing Solid",
  printings: [
    {
      id: "OP09-041",
      artId: "OP09-041",
      setCode: "OP09",
      collectorNumber: "041",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-041.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP09",
  cost: 1,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Straw Hat Crew ODYSSEY"],
  effect:
    '[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if your Leader has the "ODYSSEY" type and you have 2 or more rested Characters, set up to 2 of your Characters as active.',
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
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 2, upTo: true },
              filters: [{ filter: "state", value: "rested" }],
            },
            condition: {
              condition: "compound",
              operator: "and",
              conditions: [
                { condition: "leaderTrait", trait: "ODYSSEY", match: "includes" },
                {
                  condition: "zoneCount",
                  player: "self",
                  zone: "character",
                  comparison: "gte",
                  value: 2,
                  filters: [{ filter: "state", value: "rested" }],
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
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 4 }],
            },
          },
        ],
      },
    ],
  },
  i18n: op09SoulFrankySwingArmBoxingSolid041I18n,
};
