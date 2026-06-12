import type { CharacterCard } from "@tcg/op-types";
import { op05ONami062I18n } from "./062-o-nami.i18n.ts";

export const op05ONami062: CharacterCard = {
  id: "OP05-062",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP05",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "If you have 10 DON!! cards on your field, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  i18n: op05ONami062I18n,
};
