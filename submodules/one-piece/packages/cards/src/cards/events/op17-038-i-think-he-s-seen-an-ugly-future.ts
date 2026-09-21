import type { EventCard } from "@tcg/op-types";
import { op17IThinkHeSSeenAnUglyFuture038I18n } from "./op17-038-i-think-he-s-seen-an-ugly-future.i18n.ts";

export const op17IThinkHeSSeenAnUglyFuture038: EventCard = {
  id: "OP17-038",
  canonicalId: "OP17-038",
  slug: "i-think-he-s-seen-an-ugly-future/op17-038",
  name: "I Think He's Seen an Ugly Future...",
  printings: [
    {
      id: "OP17-038",
      artId: "OP17-038",
      setCode: "OP17",
      collectorNumber: "038",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-038_t90i9Mt.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP17",
  cost: 0,
  traits: ["Red-Haired Pirates"],
  effect:
    "[Main] You may rest 4 of your cards: Rest up to 1 of your opponent's Characters.\n[Counter] You may trash 1 card from your hand: Up to 1 of your Leader or Characters gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 4,
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
        optional: true,
      },
    ],
  },
  i18n: op17IThinkHeSSeenAnUglyFuture038I18n,
};
