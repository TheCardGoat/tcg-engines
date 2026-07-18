import type { CharacterCard } from "@tcg/op-types";
import { op01Mr3Galdino085I18n } from "./085-mr-3-galdino.i18n.ts";

export const op01Mr3Galdino085: CharacterCard = {
  id: "OP01-085",
  canonicalId: "OP01-085",
  slug: "mr-3-galdino/op01-085",
  name: "Mr.3 (Galdino)",
  printings: [
    {
      id: "OP01-085",
      artId: "OP01-085",
      setCode: "OP01",
      collectorNumber: "085",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-085.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the \"Baroque Works\" type, select up to 1 of your opponent's Characters with a cost of 4 or less. The selected Character cannot attack until the end of your opponent's next turn.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op01Mr3Galdino085I18n,
};
