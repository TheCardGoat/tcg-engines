import type { CharacterCard } from "@tcg/op-types";
import { op10JesusBurgess085I18n } from "./085-jesus-burgess.i18n.ts";

export const op10JesusBurgess085: CharacterCard = {
  id: "OP10-085",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP10",
  cost: 5,
  power: 6000,
  traits: ["Blackbeard Pirates Dressrosa"],
  attribute: "strike",
  effect: "[DON!! x1] If you have 8 or more cards in your trash, this Character gains [Rush].",
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
            zone: "trash",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op10JesusBurgess085I18n,
};
