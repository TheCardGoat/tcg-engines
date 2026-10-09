import type { EventCard } from "@tcg/op-types";
import { st03LoveLoveMellow017I18n } from "./st03-017-love-love-mellow.i18n.ts";

export const st03LoveLoveMellow017: EventCard = {
  id: "ST03-017",
  canonicalId: "ST03-017",
  slug: "love-love-mellow/st03-017",
  name: "Love-Love Mellow",
  printings: [
    {
      id: "ST03-017",
      artId: "ST03-017",
      setCode: "ST03",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST03-017.jpg",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "ST03",
  traits: ["The Seven Warlords of the Sea", "Kuja Pirates"],
  cost: 2,
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, draw 1 card if you have 3 or less cards in your hand.",
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
            },
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
            condition: {
              condition: "handCount",
              player: "self",
              comparison: "lte",
              value: 3,
            },
          },
        ],
      },
    ],
  },
  i18n: st03LoveLoveMellow017I18n,
};
