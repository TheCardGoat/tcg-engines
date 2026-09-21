import type { CharacterCard } from "@tcg/op-types";
import { op17CharlotteMontDOr111I18n } from "./op17-111-charlotte-mont-d-or.i18n.ts";

export const op17CharlotteMontDOr111: CharacterCard = {
  id: "OP17-111",
  canonicalId: "OP17-111",
  slug: "charlotte-mont-d-or/op17-111",
  name: "Charlotte Mont-d'or",
  printings: [
    {
      id: "OP17-111",
      artId: "OP17-111",
      setCode: "OP17",
      collectorNumber: "111",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-111_Ry9r07H.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP17",
  cost: 3,
  power: 4000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[On Play] You may reveal 2 cards with a [Trigger] from your hand: K.O. up to 2 of your opponent's Characters with a cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 1,
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
  i18n: op17CharlotteMontDOr111I18n,
};
