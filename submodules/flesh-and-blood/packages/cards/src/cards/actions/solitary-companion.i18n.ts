import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { solitaryCompanion } from "./solitary-companion.ts";

export const solitaryCompanionI18n = defineFamilyI18n(solitaryCompanion, {
  en: {
    name: "Solitary Companion",
    typeText: "Illusionist Action - Aura",
    text: "When this enters the arena, if you control no other Illusionist auras, create a Spectral Shield token.\nWard 1",
  },
});

export const {
  red: solitaryCompanionRedI18n,
  yellow: solitaryCompanionYellowI18n,
  blue: solitaryCompanionBlueI18n,
} = solitaryCompanionI18n.cards;
