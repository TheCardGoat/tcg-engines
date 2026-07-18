import type { CharacterCard } from "@tcg/op-types";
import { op08Thatch045I18n } from "./045-thatch.i18n.ts";

export const op08Thatch045: CharacterCard = {
  id: "OP08-045",
  canonicalId: "OP08-045",
  slug: "thatch/op08-045",
  name: "Thatch",
  printings: [
    {
      id: "OP08-045",
      artId: "OP08-045",
      setCode: "OP08",
      collectorNumber: "045",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-045.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "If this Character would be removed from the field by your opponent's effect or K.O.'d, trash this Character and draw 1 card instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        source: "opponentEffect",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "sequence",
          actions: [
            {
              action: "trashThisCard",
            },
            {
              action: "draw",
              player: "self",
              amount: 1,
            },
          ],
        },
        mandatory: true,
      },
      {
        replacedEvent: "ko",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "sequence",
          actions: [
            {
              action: "trashThisCard",
            },
            {
              action: "draw",
              player: "self",
              amount: 1,
            },
          ],
        },
        mandatory: true,
      },
    ],
  },
  i18n: op08Thatch045I18n,
};
