import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fateForeseen } from "./fate-foreseen.ts";

export const fateForeseenI18n = defineFamilyI18n(fateForeseen, {
  en: { name: "Fate Foreseen", text: "Opt 1", typeText: "Generic Defense Reaction" },
});

export const {
  red: fateForeseenRedI18n,
  yellow: fateForeseenYellowI18n,
  blue: fateForeseenBlueI18n,
} = fateForeseenI18n.cards;
