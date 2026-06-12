import type { CharacterCard } from "@tcg/op-types";
import { prb02SanjiReprint064I18n } from "./064-sanji-reprint.i18n.ts";

export const prb02SanjiReprint064: CharacterCard = {
  id: "OP07-064",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "PRB02",
  cost: 6,
  power: 6000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    'If the number of DON!! cards on your field is at least 2 less than the number on your opponent\'s field, give this card in your hand -3 cost.[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb02SanjiReprint064I18n,
};
