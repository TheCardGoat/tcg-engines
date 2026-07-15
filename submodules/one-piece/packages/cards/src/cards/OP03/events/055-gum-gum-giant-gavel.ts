import type { EventCard } from "@tcg/op-types";
import { op03GumGumGiantGavel055I18n } from "./055-gum-gum-giant-gavel.i18n.ts";

export const op03GumGumGiantGavel055: EventCard = {
  id: "OP03-055",
  canonicalId: "OP03-055",
  slug: "gum-gum-giant-gavel",
  name: "Gum-Gum Giant Gavel",
  printings: [
    {
      id: "OP03-055",
      artId: "OP03-055",
      setCode: "OP03",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-055.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  traits: ["Straw Hat Crew East Blue"],
  effect:
    "[Counter] You may trash 1 card from your hand: Up to 1 of your Leader gains +4000 power during this battle. Then, you may trash 2 cards from the top of your deck. [Trigger] Return up to 1 Character with a cost of 4 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "counter",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "returnToHand",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03GumGumGiantGavel055I18n,
};
