import type { CharacterCard } from "@tcg/op-types";
import { op15Koby009I18n } from "./op15-009-koby.i18n.ts";

export const op15Koby009: CharacterCard = {
  id: "OP15-009",
  canonicalId: "OP15-009",
  slug: "koby/op15-009",
  name: "Koby",
  printings: [
    {
      id: "OP15-009",
      artId: "OP15-009",
      setCode: "OP15",
      collectorNumber: "009",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-009_sPgQFJg.jpg",
      label: "Koby (OP15-009)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP15",
  cost: 4,
  power: 2000,
  counter: 2000,
  traits: ["Navy East Blue"],
  attribute: "strike",
  effect:
    "If your Character with 7000 base power or less would be removed from the field by your opponent's effect, you may give your Leader -2000 power during this turn instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "basePower",
              comparison: "lte",
              value: 7000,
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "modifyPower",
          target: {
            player: "self",
            zones: ["leader"],
            count: {
              amount: 1,
            },
          },
          value: -2000,
          duration: "thisTurn",
        },
      },
    ],
  },
  i18n: op15Koby009I18n,
};
