import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { reduceToRunechant } from "./reduce-to-runechant.ts";

export const reduceToRunechantI18n = defineFamilyI18n(reduceToRunechant, {
  en: {
    name: "Reduce to Runechant",
    text: "Reduce to Runechant costs {r} less to play for each Runechant you control.\nCreate a Runechant token.",
    typeText: "Runeblade Defense Reaction",
  },
});

export const {
  red: reduceToRunechantRedI18n,
  yellow: reduceToRunechantYellowI18n,
  blue: reduceToRunechantBlueI18n,
} = reduceToRunechantI18n.cards;
