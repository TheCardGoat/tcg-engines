import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arcanicShockwave } from "./arcanic-shockwave.ts";

export const arcanicShockwaveI18n = defineFamilyI18n(arcanicShockwave, {
  en: {
    name: "Arcanic Shockwave",
    text: "Lightning Fusion\nWhen you attack with Arcanic Shockwave, if it was fused, deal 1 arcane damage to target hero.",
    typeText: "Elemental Runeblade Action - Attack",
  },
});

export const {
  red: arcanicShockwaveRedI18n,
  yellow: arcanicShockwaveYellowI18n,
  blue: arcanicShockwaveBlueI18n,
} = arcanicShockwaveI18n.cards;
