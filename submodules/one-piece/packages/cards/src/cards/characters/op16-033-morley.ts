import type { CharacterCard } from "@tcg/op-types";
import { op16Morley033I18n } from "./op16-033-morley.i18n.ts";

export const op16Morley033: CharacterCard = {
  id: "OP16-033",
  canonicalId: "OP16-033",
  slug: "morley/op16-033",
  name: "Morley",
  printings: [
    {
      id: "OP16-033",
      artId: "OP16-033",
      setCode: "OP16",
      collectorNumber: "033",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-033_QK66Rgf.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP16",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Giant Revolutionary Army"],
  attribute: "special",
  effect:
    "If this Character would be K.O'd, you may rest 2 of your cards instead.\n\n[Unblockable] (This card cannot be blocked.)",
  effects: {
    keywords: ["unblockable"],
    replacementEffects: [
      {
        replacedEvent: "ko",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
        },
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["leader", "character", "stage", "costArea"],
            count: {
              amount: 2,
            },
          },
        },
      },
    ],
  },
  i18n: op16Morley033I18n,
};
