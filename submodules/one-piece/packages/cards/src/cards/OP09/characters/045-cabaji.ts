import type { CharacterCard } from "@tcg/op-types";
import { op09Cabaji045I18n } from "./045-cabaji.i18n.ts";

export const op09Cabaji045: CharacterCard = {
  id: "OP09-045",
  canonicalId: "OP09-045",
  slug: "cabaji/op09-045",
  name: "Cabaji",
  printings: [
    {
      id: "OP09-045",
      artId: "OP09-045",
      setCode: "OP09",
      collectorNumber: "045",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-045.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Cross Guild"],
  attribute: "slash",
  effect: "If you have a [Buggy] or [Mohji] Character, this Character cannot be K.O.'d in battle.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "compound",
            operator: "or",
            conditions: [
              {
                condition: "hasCard",
                player: "self",
                zone: "character",
                filters: [
                  {
                    filter: "name",
                    value: "Buggy",
                  },
                ],
              },
              {
                condition: "hasCard",
                player: "self",
                zone: "character",
                filters: [
                  {
                    filter: "name",
                    value: "Mohji",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "inBattle",
          },
        ],
      },
    ],
  },
  i18n: op09Cabaji045I18n,
};
