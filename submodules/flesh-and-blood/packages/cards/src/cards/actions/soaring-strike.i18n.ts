import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { soaringStrike } from "./soaring-strike.ts";

export const soaringStrikeI18n = defineFamilyI18n(soaringStrike, {
  en: {
    name: "Soaring Strike",
    text: "When this hits, you may banish an attack action card from your hand with cost less than the number of Draconic chain links you control. If you do, it gains go again and you may play it this turn.\nGo again",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: soaringStrikeRedI18n,
  yellow: soaringStrikeYellowI18n,
  blue: soaringStrikeBlueI18n,
} = soaringStrikeI18n.cards;
