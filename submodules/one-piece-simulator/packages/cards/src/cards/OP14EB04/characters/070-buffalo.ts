import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Buffalo070I18n } from "./070-buffalo.i18n.ts";

export const op14eb04Buffalo070: CharacterCard = {
  id: "OP14-070",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "When this Character becomes rested by your opponent's Character's effect, you may return 1 DON!! card from your field to your DON!! deck. If you do, set this Character as active.\n[Blocker]",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op14eb04Buffalo070I18n,
};
