import type { CharacterCard } from "@tcg/op-types";
import { op11MonkeyDLuffy058I18n } from "./058-monkey-d-luffy.i18n.ts";

export const op11MonkeyDLuffy058: CharacterCard = {
  id: "OP11-058",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP11",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "If you have 5 or more cards in your hand, this Character cannot attack.\n[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op11MonkeyDLuffy058I18n,
};
