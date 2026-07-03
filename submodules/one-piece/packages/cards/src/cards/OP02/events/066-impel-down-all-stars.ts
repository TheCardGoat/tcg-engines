import type { EventCard } from "@tcg/op-types";
import { op02ImpelDownAllStars066I18n } from "./066-impel-down-all-stars.i18n.ts";

export const op02ImpelDownAllStars066: EventCard = {
  id: "OP02-066",
  canonicalId: "OP02-066",
  slug: "impel-down-all-stars",
  name: "Impel Down All Stars",
  printings: [
    {
      id: "OP02-066",
      artId: "OP02-066",
      setCode: "OP02",
      collectorNumber: "066",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-066.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP02",
  cost: 1,
  traits: ["Impel Down"],
  effect:
    "[Main] You may trash 2 cards from your hand: If your Leader has the [Impel Down] type, draw up to 2 cards. [Trigger] Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Impel Down",
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
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
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op02ImpelDownAllStars066I18n,
};
