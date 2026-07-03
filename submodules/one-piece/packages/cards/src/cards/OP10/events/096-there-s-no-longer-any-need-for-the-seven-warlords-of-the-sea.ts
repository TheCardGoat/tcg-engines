import type { EventCard } from "@tcg/op-types";
import { op10ThereSNoLongerAnyNeedForTheSevenWarlordsOfTheSea096I18n } from "./096-there-s-no-longer-any-need-for-the-seven-warlords-of-the-sea.i18n.ts";

export const op10ThereSNoLongerAnyNeedForTheSevenWarlordsOfTheSea096: EventCard = {
  id: "OP10-096",
  canonicalId: "OP10-096",
  slug: "there-s-no-longer-any-need-for-the-seven-warlords-of-the-sea",
  name: "There's No Longer Any Need for the Seven Warlords of the Sea!!!",
  printings: [
    {
      id: "OP10-096",
      artId: "OP10-096",
      setCode: "OP10",
      collectorNumber: "096",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-096.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP10",
  cost: 4,
  trigger:
    'K.O. up to 1 of your opponent\'s "The Seven Warlords of the Sea" type Characters with a cost of 4 or less.',
  traits: ["Navy"],
  effect:
    '[Main] K.O. up to 1 of your opponent\'s "The Seven Warlords of the Sea" type Characters with a cost of 8 or less.',
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
                  filter: "trait",
                  value: "The Seven Warlords of the Sea",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 8,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10ThereSNoLongerAnyNeedForTheSevenWarlordsOfTheSea096I18n,
};
