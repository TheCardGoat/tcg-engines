import type { CharacterCard } from "@tcg/op-types";
import { op10ScratchmenApoo108I18n } from "./108-scratchmen-apoo.i18n.ts";

export const op10ScratchmenApoo108: CharacterCard = {
  id: "OP10-108",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP10",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["On-Air Pirates Supernovas"],
  attribute: "ranged",
  effect:
    'If you have a yellow "Supernovas" type Character other than [Scratchmen Apoo], this Character gains [Blocker].',
  i18n: op10ScratchmenApoo108I18n,
};
