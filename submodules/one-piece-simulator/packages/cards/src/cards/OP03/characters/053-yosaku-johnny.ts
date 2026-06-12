import type { CharacterCard } from "@tcg/op-types";
import { op03YosakuJohnny053I18n } from "./053-yosaku-johnny.i18n.ts";

export const op03YosakuJohnny053: CharacterCard = {
  id: "OP03-053",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP03",
  cost: 1,
  power: 3000,
  traits: ["East Blue"],
  attribute: "slash",
  effect: "[DON!! x1] If you have 20 or less cards in your deck, this Character gains +2000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "zoneCount",
            player: "self",
            zone: "deck",
            comparison: "lte",
            value: 20,
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
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op03YosakuJohnny053I18n,
};
