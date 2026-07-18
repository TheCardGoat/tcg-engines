import type { EventCard } from "@tcg/op-types";
import { op14eb04YouLlFrightenMe118I18n } from "./118-you-ll-frighten-me.i18n.ts";

export const op14eb04YouLlFrightenMe118: EventCard = {
  id: "OP14-118",
  canonicalId: "OP14-118",
  slug: "you-ll-frighten-me",
  name: "You'll Frighten Me...",
  printings: [
    {
      id: "OP14-118",
      artId: "OP14-118",
      setCode: "OP14EB04",
      collectorNumber: "118",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-118_4AgRRKu.jpg",
    },
    {
      id: "OP14-118_p1",
      artId: "OP14-118_p1",
      setCode: "OP14EB04",
      collectorNumber: "118",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-118_p1_h4F7bDJ.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  trigger: "Play up to 1 Character card with 6000 power or less and a [Trigger] from your hand.",
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-118_p1_h4F7bDJ.jpg",
      imageId: "OP14-118_p1",
    },
  ],
  effect:
    "[Counter] If you have 2 or less Life cards, up to 1 of your opponent's active Characters cannot attack during this turn.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "active",
                },
              ],
            },
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "cardCategory", value: "character" },
              { filter: "power", comparison: "lte", value: 6000 },
              { filter: "hasTrigger", value: true },
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04YouLlFrightenMe118I18n,
};
