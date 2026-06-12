import type { CharacterCard } from "@tcg/op-types";
import { prb01SogekingManga122I18n } from "./122-sogeking-manga.i18n.ts";

export const prb01SogekingManga122: CharacterCard = {
  id: "OP03-122",
  cardType: "character",
  color: ["blue"],
  rarity: "SEC",
  setId: "PRB01",
  cost: 7,
  power: 6000,
  counter: 1000,
  traits: ["Sniper Island"],
  attribute: "ranged",
  effect:
    "Also treat this card's name as [Usopp] according to the rules.[On Play] Return up to 1 Character with a cost of 6 or less to the owner's hand. Then, draw 2 cards and trash 2 cards from your hand.Disclaimer: This card was reprinted from the original set without the original textured foil.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 6,
                },
              ],
            },
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
  i18n: prb01SogekingManga122I18n,
};
