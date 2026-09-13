import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sigilOfSolitude } from "./sigil-of-solitude.ts";

export const sigilOfSolitudeI18n = defineFamilyI18n(sigilOfSolitude, {
  en: {
    name: "Sigil of Solitude",
    typeText: "Illusionist Action - Aura",
    text: "At the start of your turn, if you control another Illusionist aura, destroy this.\nWard 4",
  },
});

export const {
  red: sigilOfSolitudeRedI18n,
  yellow: sigilOfSolitudeYellowI18n,
  blue: sigilOfSolitudeBlueI18n,
} = sigilOfSolitudeI18n.cards;
