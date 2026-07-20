import type { CharacterCard } from "@tcg/op-types";
import { op13ScopperGaban067I18n } from "./067-scopper-gaban.i18n.ts";

export const op13ScopperGaban067: CharacterCard = {
  id: "OP13-067",
  canonicalId: "OP13-067",
  slug: "scopper-gaban",
  name: "Scopper Gaban",
  printings: [
    {
      id: "OP13-067",
      artId: "OP13-067",
      setCode: "OP13",
      collectorNumber: "067",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-067_lH0Gl8k.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP13",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["Roger Pirates"],
  attribute: "slash",
  effect:
    '[On Play] If your Leader\'s type includes "Roger Pirates", draw 2 cards and trash 1 card from your hand. Then, add up to 1 DON!! card from your DON!! deck and rest it.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Roger Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op13ScopperGaban067I18n,
};
