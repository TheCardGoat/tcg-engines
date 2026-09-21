import type { CharacterCard } from "@tcg/op-types";
import { op17WhoSWho071I18n } from "./op17-071-who-s-who.i18n.ts";

export const op17WhoSWho071: CharacterCard = {
  id: "OP17-071",
  canonicalId: "OP17-071",
  slug: "who-s-who/op17-071",
  name: "Who's.Who",
  printings: [
    {
      id: "OP17-071",
      artId: "OP17-071",
      setCode: "OP17",
      collectorNumber: "071",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-071_zQ4nkXT.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP17",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Animal Kingdom Pirates Former CP9"],
  attribute: "slash",
  effect:
    "[On Play] DON!! -1: K.O. up to 2 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: op17WhoSWho071I18n,
};
