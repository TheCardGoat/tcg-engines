import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { destructiveDeliberation } from "./destructive-deliberation.ts";

export const destructiveDeliberationI18n = defineFamilyI18n(destructiveDeliberation, {
  en: {
    name: "Destructive Deliberation",
    typeText: "Generic Action - Attack",
    text: "When this hits a hero, create a Ponder token.",
  },
});

export const {
  red: destructiveDeliberationRedI18n,
  yellow: destructiveDeliberationYellowI18n,
  blue: destructiveDeliberationBlueI18n,
} = destructiveDeliberationI18n.cards;
