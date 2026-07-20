import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Mr3Galdino092I18n } from "./092-mr-3-galdino.i18n.ts";

export const op14eb04Mr3Galdino092: CharacterCard = {
  id: "OP14-092",
  canonicalId: "OP14-092",
  slug: "mr-3-galdino/op14-092",
  name: "Mr.3(Galdino)",
  printings: [
    {
      id: "OP14-092",
      artId: "OP14-092",
      setCode: "OP14EB04",
      collectorNumber: "092",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-092_c8cwJmJ.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 4,
  power: 6000,
  traits: ["Baroque Works"],
  attribute: "special",
  effect:
    "[Opponent's Turn] [Once Per Turn] If this Character would be K.O.'d, you may place 3 cards from your trash at the bottom of your deck in any order instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "returnToDeck",
          target: {
            player: "self",
            zones: ["trash"],
            count: {
              amount: 3,
            },
          },
          position: "bottom",
        },
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04Mr3Galdino092I18n,
};
