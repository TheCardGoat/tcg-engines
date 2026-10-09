import type { EventCard } from "@tcg/op-types";
import { st04BrachioBomber015I18n } from "./st04-015-brachio-bomber.i18n.ts";

export const st04BrachioBomber015: EventCard = {
  id: "ST04-015",
  canonicalId: "ST04-015",
  slug: "brachio-bomber/st04-015",
  name: "Brachio Bomber",
  printings: [
    {
      id: "ST04-015",
      artId: "ST04-015",
      setCode: "ST04",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST04-015.png",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "ST04",
  cost: 6,
  traits: ["Animal Kingdom Pirates"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost of 6 or less, then add up to 1 DON!! card from your DON!! deck and set it as active.",
  trigger: "[Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: st04BrachioBomber015I18n,
};
