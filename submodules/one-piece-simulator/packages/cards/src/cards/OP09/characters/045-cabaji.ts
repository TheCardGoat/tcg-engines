import type { CharacterCard } from "@tcg/op-types";
import { op09Cabaji045I18n } from "./045-cabaji.i18n.ts";

export const op09Cabaji045: CharacterCard = {
  id: "OP09-045",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 5000,
  counter: 2000,
  traits: ["Cross Guild"],
  attribute: "slash",
  effect: "If you have a [Buggy] or [Mohji] Character, this Character cannot be K.O.'d in battle.",
  i18n: op09Cabaji045I18n,
};
