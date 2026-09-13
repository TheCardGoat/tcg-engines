import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { enionSurge } from "./enion-surge.ts";

export const enionSurgeI18n = defineFamilyI18n(enionSurge, {
  en: {
    name: "Enion Surge",
    text: (_parameter, color) =>
      `Deal ${color === "red" ? 2 : color === "yellow" ? 3 : 1} arcane damage to any target.\nIf this deals damage, you may {t} your hero. If you do, create a Lightning Flow token.`,
    typeText: "Lightning Wizard Action",
  },
});

export const {
  red: enionSurgeRedI18n,
  yellow: enionSurgeYellowI18n,
  blue: enionSurgeBlueI18n,
} = enionSurgeI18n.cards;
