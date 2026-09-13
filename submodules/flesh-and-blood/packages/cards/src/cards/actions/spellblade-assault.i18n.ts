import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spellbladeAssault } from "./spellblade-assault.ts";

export const spellbladeAssaultI18n = defineFamilyI18n(spellbladeAssault, {
  en: {
    name: "Spellblade Assault",
    text: "When you attack with Spellblade Assault, create 2 Runechant tokens.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: spellbladeAssaultRedI18n,
  yellow: spellbladeAssaultYellowI18n,
  blue: spellbladeAssaultBlueI18n,
} = spellbladeAssaultI18n.cards;
