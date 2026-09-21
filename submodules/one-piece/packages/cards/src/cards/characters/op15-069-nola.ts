import type { CharacterCard } from "@tcg/op-types";
import { op15Nola069I18n } from "./op15-069-nola.i18n.ts";

export const op15Nola069: CharacterCard = {
  id: "OP15-069",
  canonicalId: "OP15-069",
  slug: "nola/op15-069",
  name: "Nola",
  printings: [
    {
      id: "OP15-069",
      artId: "OP15-069",
      setCode: "OP15",
      collectorNumber: "069",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-069.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP15",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Animal Sky Island"],
  attribute: "strike",
  effect:
    "If your Character with 7000 base power or less would be removed from the field by your opponent's effect, you may return 1 DON!! card from your field to your DON!! deck instead.",
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
          action: "returnDon",
          player: "self",
          amount: 1,
        },
      },
    ],
  },
  i18n: op15Nola069I18n,
};
