import type { CharacterCard } from "@tcg/op-types";
import { op07Baskerville087I18n } from "./087-baskerville.i18n.ts";

export const op07Baskerville087: CharacterCard = {
  id: "OP07-087",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP07",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["World Government"],
  attribute: "slash",
  effect:
    "[Your Turn] If your opponent has a Character with a cost of 0, this Character gains +3000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
          {
            condition: "hasCard",
            player: "opponent",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 0,
              },
            ],
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
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op07Baskerville087I18n,
};
