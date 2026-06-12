import type { CharacterCard } from "@tcg/op-types";
import { op12Koushirou027I18n } from "./027-koushirou.i18n.ts";

export const op12Koushirou027: CharacterCard = {
  id: "OP12-027",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP12",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["East Blue Frost Moon Village"],
  attribute: "slash",
  effect:
    "If your (Slash) attribute Character with a cost of 5 or less other than this Character would be K.O.'d by your opponent's effect, you may rest this Character instead.\n[Blocker]",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op12Koushirou027I18n,
};
