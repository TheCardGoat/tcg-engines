import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { strikeGold } from "./strike-gold.ts";

export const strikeGoldI18n = defineFamilyI18n(strikeGold, {
  en: {
    name: "Strike Gold",
    text: "When this hits, create a Gold token.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: strikeGoldRedI18n,
  yellow: strikeGoldYellowI18n,
  blue: strikeGoldBlueI18n,
} = strikeGoldI18n.cards;
