import type { EventCard } from "@tcg/op-types";
import { op17WithdrawNowAndAllowMeToSaveFace036I18n } from "./op17-036-withdraw-now-and-allow-me-to-save-face.i18n.ts";

export const op17WithdrawNowAndAllowMeToSaveFace036: EventCard = {
  id: "OP17-036",
  canonicalId: "OP17-036",
  slug: "withdraw-now-and-allow-me-to-save-face/op17-036",
  name: "Withdraw Now and Allow Me to Save Face",
  printings: [
    {
      id: "OP17-036",
      artId: "OP17-036",
      setCode: "OP17",
      collectorNumber: "036",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-036_sck9Dv5.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP17",
  cost: 1,
  traits: ["The Four Emperors Red-Haired Pirates"],
  effect:
    "[Main] You may rest 6 of your DON!! cards: Rest up to 1 of your opponent's Characters. Then, K.O. up to 2 of your opponent's rested Characters with a cost of 6 or less.\n\n[Counter] Up to 1 of your [Shanks] gains +4000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restDon",
            amount: 6,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17WithdrawNowAndAllowMeToSaveFace036I18n,
};
