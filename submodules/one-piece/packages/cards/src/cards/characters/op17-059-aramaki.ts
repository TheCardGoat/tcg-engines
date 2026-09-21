import type { CharacterCard } from "@tcg/op-types";
import { op17Aramaki059I18n } from "./op17-059-aramaki.i18n.ts";

export const op17Aramaki059: CharacterCard = {
  id: "OP17-059",
  canonicalId: "OP17-059",
  slug: "aramaki/op17-059",
  name: "Aramaki",
  printings: [
    {
      id: "OP17-059",
      artId: "OP17-059",
      setCode: "OP17",
      collectorNumber: "059",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-059_zIZTBCT.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP17",
  cost: 7,
  power: 8000,
  traits: ["Navy Admiral"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] DON!! -1: Draw 1 card and K.O. up to 2 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    keywords: ["blocker"],
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
            action: "draw",
            player: "self",
            amount: 1,
          },
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
    ],
  },
  i18n: op17Aramaki059I18n,
};
