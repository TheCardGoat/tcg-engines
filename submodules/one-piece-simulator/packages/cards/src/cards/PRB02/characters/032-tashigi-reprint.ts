import type { CharacterCard } from "@tcg/op-types";
import { prb02TashigiReprint032I18n } from "./032-tashigi-reprint.i18n.ts";

export const prb02TashigiReprint032: CharacterCard = {
  id: "OP10-032",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "PRB02",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Navy Punk Hazard"],
  attribute: "special",
  effect:
    'If you have a green Character other than [Tashigi] that would be removed from the field by your opponent\'s effect, you may rest this Character instead.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  i18n: prb02TashigiReprint032I18n,
};
