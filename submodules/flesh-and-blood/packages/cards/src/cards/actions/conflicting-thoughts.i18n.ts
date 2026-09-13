import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { conflictingThoughts } from "./conflicting-thoughts.ts";

export const conflictingThoughtsI18n = defineFamilyI18n(conflictingThoughts, {
  en: {
    name: "Conflicting Thoughts",
    typeText: "Generic Action - Attack",
    text: "When this attacks, opt 1.",
  },
});

export const {
  red: conflictingThoughtsRedI18n,
  yellow: conflictingThoughtsYellowI18n,
  blue: conflictingThoughtsBlueI18n,
} = conflictingThoughtsI18n.cards;
