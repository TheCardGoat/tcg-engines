import type { CharacterCard } from "@tcg/op-types";
import { op15Perona090I18n } from "./op15-090-perona.i18n.ts";

export const op15Perona090: CharacterCard = {
  id: "OP15-090",
  canonicalId: "OP15-090",
  slug: "perona/op15-090",
  name: "Perona",
  printings: [
    {
      id: "OP15-090",
      artId: "OP15-090",
      setCode: "OP15",
      collectorNumber: "090",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-090_gC0C5OP.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Thriller Bark Pirates"],
  attribute: "special",
  effect:
    "If your Character with 7000 base power or less would be removed from the field by your opponent's effect, you may trash 1 card from your hand instead.",
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
          action: "trashFromHand",
          player: "self",
          amount: 1,
        },
      },
    ],
  },
  i18n: op15Perona090I18n,
};
