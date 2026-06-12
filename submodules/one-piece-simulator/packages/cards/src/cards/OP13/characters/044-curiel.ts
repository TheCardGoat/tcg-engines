import type { CharacterCard } from "@tcg/op-types";
import { op13Curiel044I18n } from "./044-curiel.i18n.ts";

export const op13Curiel044: CharacterCard = {
  id: "OP13-044",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 4000,
  traits: ["Whitebeard Pirates"],
  attribute: "ranged",
  effect:
    '[When Attacking] Give up to 1 rested DON!! card to your Leader with a type including "Whitebeard Pirates" or 1 Character with a type including "Whitebeard Pirates".\n[On K.O.] Draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                },
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op13Curiel044I18n,
};
