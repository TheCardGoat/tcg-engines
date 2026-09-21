import type { LeaderCard } from "@tcg/op-types";
import { op17Shanks020I18n } from "./op17-020-shanks.i18n.ts";

export const op17Shanks020: LeaderCard = {
  id: "OP17-020",
  canonicalId: "OP17-020",
  slug: "shanks/op17-020",
  name: "Shanks",
  printings: [
    {
      id: "OP17-020",
      artId: "OP17-020",
      setCode: "OP17",
      collectorNumber: "020",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-020_C3FdLNk.jpg",
      label: "Shanks (020)",
    },
    {
      id: "OP17-020_p1",
      artId: "OP17-020_p1",
      setCode: "OP17",
      collectorNumber: "020",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-020_p1_GddFLIb.jpg",
      label: "Shanks (020) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP17",
  power: 5000,
  life: 5,
  traits: ["The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] You may trash 1 card from your hand or rest 1 of your DON!! cards: Up to 1 of your opponent's rested Characters will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
          {
            cost: "restDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op17Shanks020I18n,
};
