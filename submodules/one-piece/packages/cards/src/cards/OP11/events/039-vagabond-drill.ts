import type { EventCard } from "@tcg/op-types";
import { op11VagabondDrill039I18n } from "./039-vagabond-drill.i18n.ts";

export const op11VagabondDrill039: EventCard = {
  id: "OP11-039",
  canonicalId: "OP11-039",
  slug: "vagabond-drill",
  name: "Vagabond Drill",
  printings: [
    {
      id: "OP11-039",
      artId: "OP11-039",
      setCode: "OP11",
      collectorNumber: "039",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-039.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP11",
  cost: 1,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Fish-Man The Sun Pirates Fish-Man Island"],
  effect:
    '[Counter] Up to 1 of your "Fish-Man" or "Merfolk" type Leader or Character cards gains +3000 power during this battle. Then, rest up to 1 of your opponent\'s Characters with a cost of 3 or less.',
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
              filters: [
                {
                  filter: "anyOf",
                  groups: [
                    [{ filter: "trait", value: "Fish-Man", match: "includes" }],
                    [{ filter: "trait", value: "Merfolk", match: "includes" }],
                  ],
                },
              ],
            },
            value: 3000,
            duration: "thisBattle",
          },
          {
            action: "rest",
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
                  value: 3,
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
  i18n: op11VagabondDrill039I18n,
};
