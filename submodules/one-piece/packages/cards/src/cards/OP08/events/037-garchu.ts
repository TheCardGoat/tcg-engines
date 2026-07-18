import type { EventCard } from "@tcg/op-types";
import { op08Garchu037I18n } from "./037-garchu.i18n.ts";

export const op08Garchu037: EventCard = {
  id: "OP08-037",
  canonicalId: "OP08-037",
  slug: "garchu",
  name: "Garchu",
  printings: [
    {
      id: "OP08-037",
      artId: "OP08-037",
      setCode: "OP08",
      collectorNumber: "037",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-037.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP08",
  cost: 1,
  traits: ["Minks"],
  effect:
    "[Main] You may rest 1 of your {Minks} type Characters: Rest up to 1 of your opponent's Characters. [Trigger] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Minks",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
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
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op08Garchu037I18n,
};
