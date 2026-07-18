import type { CharacterCard } from "@tcg/op-types";
import { op10Pica074I18n } from "./074-pica.i18n.ts";

export const op10Pica074: CharacterCard = {
  id: "OP10-074",
  canonicalId: "OP10-074",
  slug: "pica/op10-074",
  name: "Pica",
  printings: [
    {
      id: "OP10-074",
      artId: "OP10-074",
      setCode: "OP10",
      collectorNumber: "074",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-074.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "[Once Per Turn] If this Character would be K.O.'d by your opponent's effect, you may rest 2 of your active DON!! cards instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        source: "opponentEffect",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["costArea"],
            count: {
              amount: 2,
            },
            filters: [
              {
                filter: "state",
                value: "active",
              },
            ],
          },
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: op10Pica074I18n,
};
