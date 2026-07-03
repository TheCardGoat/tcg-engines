import type { CharacterCard } from "@tcg/op-types";
import { prb01SaboOp04083Manga083I18n } from "./083-sabo-op04-083-manga.i18n.ts";

export const prb01SaboOp04083Manga083: CharacterCard = {
  id: "OP04-083",
  canonicalId: "OP04-083",
  slug: "sabo-op04-083-manga",
  name: "Sabo (OP04-083) (Manga)",
  printings: [
    {
      id: "OP04-083",
      artId: "OP04-083",
      setCode: "PRB01",
      collectorNumber: "083",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-083_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "PRB01",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] None of your Characters can be K.O.'d by effects until the start of your next turn. Then, draw 2 cards and trash 2 cards from your hand.Disclaimer: This card was reprinted from the original set without the original textured foil.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            duration: "untilStartOfNextTurn",
            restriction: "byEffect",
          },
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: prb01SaboOp04083Manga083I18n,
};
