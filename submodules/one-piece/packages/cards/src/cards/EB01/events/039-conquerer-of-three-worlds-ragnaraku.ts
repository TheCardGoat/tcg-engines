import type { EventCard } from "@tcg/op-types";
import { eb01ConquererOfThreeWorldsRagnaraku039I18n } from "./039-conquerer-of-three-worlds-ragnaraku.i18n.ts";

export const eb01ConquererOfThreeWorldsRagnaraku039: EventCard = {
  id: "EB01-039",
  canonicalId: "EB01-039",
  slug: "conquerer-of-three-worlds-ragnaraku",
  name: "Conquerer of Three Worlds Ragnaraku",
  printings: [
    {
      id: "EB01-039",
      artId: "EB01-039",
      setCode: "EB01",
      collectorNumber: "039",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-039.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "EB01",
  cost: 5,
  traits: ["Animal Kingdom Pirates The Four Emperors"],
  effect:
    "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 8 or less.[Trigger] Ad up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
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
                  value: 8,
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
  i18n: eb01ConquererOfThreeWorldsRagnaraku039I18n,
};
