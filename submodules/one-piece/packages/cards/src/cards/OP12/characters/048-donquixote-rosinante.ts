import type { CharacterCard } from "@tcg/op-types";
import { op12DonquixoteRosinante048I18n } from "./048-donquixote-rosinante.i18n.ts";

export const op12DonquixoteRosinante048: CharacterCard = {
  id: "OP12-048",
  canonicalId: "OP12-048",
  slug: "donquixote-rosinante/op12-048",
  name: "Donquixote Rosinante",
  printings: [
    {
      id: "OP12-048",
      artId: "OP12-048",
      setCode: "OP12",
      collectorNumber: "048",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-048_Jjbmcxk.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[Opponent's Turn] If your blue \"Navy\" type Character would be removed from the field by your opponent's effect, you may rest this Character and trash 1 card from your hand instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
            self: true,
          },
        },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
      },
    ],
  },
  i18n: op12DonquixoteRosinante048I18n,
};
