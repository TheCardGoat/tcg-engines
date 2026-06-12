import type { CharacterCard } from "@tcg/op-types";
import { op04MonkeyDLuffy014I18n } from "./014-monkey-d-luffy.i18n.ts";

export const op04MonkeyDLuffy014: CharacterCard = {
  id: "OP04-014",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP04",
  cost: 8,
  power: 9000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    keywords: ["banish"],
  },
  i18n: op04MonkeyDLuffy014I18n,
};
