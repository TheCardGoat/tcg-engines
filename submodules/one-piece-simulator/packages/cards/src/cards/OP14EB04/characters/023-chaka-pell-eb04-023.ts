import type { CharacterCard } from "@tcg/op-types";
import { op14eb04ChakaPellEb04023023I18n } from "./023-chaka-pell-eb04-023.i18n.ts";

export const op14eb04ChakaPellEb04023023: CharacterCard = {
  id: "EB04-023",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 8,
  power: 9000,
  traits: ["Alabasta"],
  attribute: "slash",
  effect:
    "[Double Attack] (This card deals 2 damage.)\n[On Play] You may give your active Leader -5000 power during this turn: Draw 2 cards.",
  effects: {
    keywords: ["doubleAttack"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04ChakaPellEb04023023I18n,
};
