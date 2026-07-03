import type { EventCard } from "@tcg/op-types";
import { op13PaperArtAfterimage115I18n } from "./115-paper-art-afterimage.i18n.ts";

export const op13PaperArtAfterimage115: EventCard = {
  id: "OP13-115",
  canonicalId: "OP13-115",
  slug: "paper-art-afterimage",
  name: "Paper Art Afterimage",
  printings: [
    {
      id: "OP13-115",
      artId: "OP13-115",
      setCode: "OP13",
      collectorNumber: "115",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-115_zQQJNmf.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  trigger: "Draw 1 card.",
  traits: ["CP0 Egghead"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, if your opponent has 2 or less Life cards, up to 1 of your Leader or Character cards gains +1000 power during this turn.",
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
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op13PaperArtAfterimage115I18n,
};
