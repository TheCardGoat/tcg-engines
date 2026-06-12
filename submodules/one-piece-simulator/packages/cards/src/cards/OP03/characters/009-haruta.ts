import type { CharacterCard } from "@tcg/op-types";
import { op03Haruta009I18n } from "./009-haruta.i18n.ts";

export const op03Haruta009: CharacterCard = {
  id: "OP03-009",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "[Activate:Main] [Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op03Haruta009I18n,
};
