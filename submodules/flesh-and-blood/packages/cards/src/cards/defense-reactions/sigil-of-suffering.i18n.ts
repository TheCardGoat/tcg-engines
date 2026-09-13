import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sigilOfSuffering } from "./sigil-of-suffering.ts";

export const sigilOfSufferingI18n = defineFamilyI18n(sigilOfSuffering, {
  en: {
    name: "Sigil of Suffering",
    text: "Deal 1 arcane damage to the attacking hero.\nIf you have dealt arcane damage this turn, Sigil of Suffering gains +1{d}.",
    typeText: "Runeblade Defense Reaction",
  },
});

export const {
  red: sigilOfSufferingRedI18n,
  yellow: sigilOfSufferingYellowI18n,
  blue: sigilOfSufferingBlueI18n,
} = sigilOfSufferingI18n.cards;
