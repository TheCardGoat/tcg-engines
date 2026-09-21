import type { StageCard } from "@tcg/op-types";
import { eb04LuluciaKingdom010I18n } from "./eb04-010-lulucia-kingdom.i18n.ts";

export const eb04LuluciaKingdom010: StageCard = {
  id: "EB04-010",
  canonicalId: "EB04-010",
  slug: "lulucia-kingdom/eb04-010",
  name: "Lulucia Kingdom",
  printings: [
    {
      id: "EB04-010",
      artId: "EB04-010",
      setCode: "EB04",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-010_jBjnlAt.jpg",
    },
  ],
  cardType: "stage",
  color: ["red"],
  rarity: "C",
  setId: "EB04",
  cost: 7,
  traits: ["Lulucia Kingdom"],
  effect:
    "[Opponent's Turn] All of your Characters with a base cost of 1 gain +5000 power.[On Play] Set the power of up to 1 of your opponent's Characters to 0 during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "setPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 0,
            duration: "thisTurn",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
            value: 5000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb04LuluciaKingdom010I18n,
};
