import type { CharacterCard } from "@tcg/op-types";
import { op03Gaimon043I18n } from "./043-gaimon.i18n.ts";

export const op03Gaimon043: CharacterCard = {
  id: "OP03-043",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "When you deal damage to your opponent's Life, you may trash 3 cards from the top of your deck. If you do, trash this Character.",
  i18n: op03Gaimon043I18n,
};
