import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arcanicCrackle } from "./arcanic-crackle.ts";

export const arcanicCrackleI18n = defineFamilyI18n(arcanicCrackle, {
  en: {
    name: "Arcanic Crackle",
    text: "When this attacks, deal 1 arcane damage to target hero.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: arcanicCrackleRedI18n,
  yellow: arcanicCrackleYellowI18n,
  blue: arcanicCrackleBlueI18n,
} = arcanicCrackleI18n.cards;
