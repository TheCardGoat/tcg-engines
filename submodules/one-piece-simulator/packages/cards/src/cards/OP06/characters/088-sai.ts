import type { CharacterCard } from "@tcg/op-types";
import { op06Sai088I18n } from "./088-sai.i18n.ts";

export const op06Sai088: CharacterCard = {
  id: "OP06-088",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Happosui Army Dressrosa"],
  attribute: "slash",
  effect:
    "If your Leader has the [Dressrosa] type and is active, this Character gains +2000 power.",
  i18n: op06Sai088I18n,
};
