import type { CharacterCard } from "@tcg/op-types";
import { op01Mr1DazBonez083I18n } from "./083-mr-1-daz-bonez.i18n.ts";

export const op01Mr1DazBonez083: CharacterCard = {
  id: "OP01-083",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "slash",
  effect:
    '[DON!! x1] [Your Turn] If your Leader has the "Baroque Works" type, this Character gains +1000 power for every 2 Events in your trash.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "leaderTrait",
            trait: "Baroque Works",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op01Mr1DazBonez083I18n,
};
