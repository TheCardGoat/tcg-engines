import type { EventCard } from "@tcg/op-types";
import { op13PaperArtAfterimage115I18n } from "./115-paper-art-afterimage.i18n.ts";

export const op13PaperArtAfterimage115: EventCard = {
  id: "OP13-115",
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
