import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { astralEtchings } from "./astral-etchings.ts";

export const astralEtchingsI18n = defineFamilyI18n(astralEtchings, {
  en: {
    name: "Astral Etchings",
    typeText: "Illusionist Action",
    text: (_parameter, color) =>
      `Put ${color === "red" ? "three +1{p} counters" : color === "yellow" ? "two +1{p} counters" : "a +1{p} counter"} on target aura with ward you control.\nIf you control a Spectral Shield, you may play this as though it were an instant.`,
  },
});

export const {
  red: astralEtchingsRedI18n,
  yellow: astralEtchingsYellowI18n,
  blue: astralEtchingsBlueI18n,
} = astralEtchingsI18n.cards;
