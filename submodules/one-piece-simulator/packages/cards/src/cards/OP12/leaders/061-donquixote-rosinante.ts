import type { LeaderCard } from "@tcg/op-types";
import { op12DonquixoteRosinante061I18n } from "./061-donquixote-rosinante.i18n.ts";

export const op12DonquixoteRosinante061: LeaderCard = {
  id: "OP12-061",
  cardType: "leader",
  color: ["purple", "yellow"],
  rarity: "L",
  setId: "OP12",
  power: 5000,
  life: 4,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-061_p1_dkgb1AW.jpg",
      imageId: "OP12-061_p1",
    },
  ],
  effect:
    "[Once Per Turn] If your [Trafalgar Law] would be K.O.'d, you may add 1 card from the top of your Life cards to your hand instead.\n[Activate: Main] [Once Per Turn] DON!! 1: The next time you play [Trafalgar Law] with a cost of 4 or more from your hand during this turn, the cost will be reduced by 2.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Trafalgar Law",
                },
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 4,
                },
              ],
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        replacementAction: {
          action: "removeFromLife",
          player: "self",
          count: {
            amount: 1,
          },
          destination: "hand",
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12DonquixoteRosinante061I18n,
};
