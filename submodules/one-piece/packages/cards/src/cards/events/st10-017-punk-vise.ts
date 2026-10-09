import type { EventCard } from "@tcg/op-types";
import { st10PunkVise017I18n } from "./st10-017-punk-vise.i18n.ts";
export const st10PunkVise017: EventCard = {
  id: "ST10-017",
  canonicalId: "ST10-017",
  slug: "punk-vise/st10-017",
  name: "Punk Vise",
  printings: [
    {
      id: "ST10-017",
      artId: "ST10-017",
      setCode: "ST10",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST10-017.png",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "ST10",
  cost: 3,
  traits: ["Kid Pirates"],
  effect:
    "[Main] Rest up to 1 of your opponent's Characters with a cost of 2 or less, and add up to 1 DON!! card from your DON!! deck and rest it.",
  trigger: "Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
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
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
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
            state: "rested",
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
  i18n: st10PunkVise017I18n,
};
