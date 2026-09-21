import type { EventCard } from "@tcg/op-types";
import { op16Zehahahahaha116I18n } from "./op16-116-zehahahahaha.i18n.ts";

export const op16Zehahahahaha116: EventCard = {
  id: "OP16-116",
  canonicalId: "OP16-116",
  slug: "zehahahahaha/op16-116",
  name: "Zehahahahaha!",
  printings: [
    {
      id: "OP16-116",
      artId: "OP16-116",
      setCode: "OP16",
      collectorNumber: "116",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-116_FVqesp1.jpg",
    },
    {
      id: "OP16-116_p1",
      artId: "OP16-116_p1",
      setCode: "OP16",
      collectorNumber: "116",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-116_p1_lLhpYkl.jpg",
      label: "Zehahahahaha! (Alternate Art)",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP16",
  cost: 8,
  trigger: "Draw 2 cards and trash 1 card from your hand.",
  traits: ["Blackbeard Pirates The Seven Warlords of the Sea"],
  effect:
    "[Main] If you have 10 DON!! cards on your field, play up to 1 [Marshall.D.Teach] from your hand. Then, add up to 1 card from the top of your opponent's Life cards to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "eq",
            value: 10,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Marshall.D.Teach",
              },
            ],
          },
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "hand",
          },
        ],
      },
    ],
  },
  i18n: op16Zehahahahaha116I18n,
};
