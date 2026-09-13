import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { criticalStrike } from "./critical-strike.ts";

export const criticalStrikeI18n = defineFamilyI18n(criticalStrike, {
  en: { name: "Critical Strike", typeText: "Generic Action - Attack" },
});

export const {
  red: criticalStrikeRedI18n,
  yellow: criticalStrikeYellowI18n,
  blue: criticalStrikeBlueI18n,
} = criticalStrikeI18n.cards;
