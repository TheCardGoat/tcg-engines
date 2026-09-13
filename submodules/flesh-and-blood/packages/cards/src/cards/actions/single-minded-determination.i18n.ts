import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { singleMindedDetermination } from "./single-minded-determination.ts";

export const singleMindedDeterminationI18n = defineFamilyI18n(singleMindedDetermination, {
  en: {
    name: "Single Minded Determination",
    typeText: "Illusionist Action - Aura",
    text: "When this enters the arena, if you control no other Illusionist auras, put three +1{p} counters on this.\nWard 2",
  },
});

export const {
  red: singleMindedDeterminationRedI18n,
  yellow: singleMindedDeterminationYellowI18n,
  blue: singleMindedDeterminationBlueI18n,
} = singleMindedDeterminationI18n.cards;
