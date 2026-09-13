import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spellbladeStrike } from "./spellblade-strike.ts";

export const spellbladeStrikeI18n = defineFamilyI18n(spellbladeStrike, {
  en: {
    name: "Spellblade Strike",
    text: "Create a Runechant token.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: spellbladeStrikeRedI18n,
  yellow: spellbladeStrikeYellowI18n,
  blue: spellbladeStrikeBlueI18n,
} = spellbladeStrikeI18n.cards;
