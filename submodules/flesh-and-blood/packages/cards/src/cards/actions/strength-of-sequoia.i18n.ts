import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { strengthOfSequoia } from "./strength-of-sequoia.ts";

export const strengthOfSequoiaI18n = defineFamilyI18n(strengthOfSequoia, {
  en: {
    name: "Strength of Sequoia",
    text: "Earth Fusion\nGo again\nWhen Strength of Sequoia enters the arena, if it was fused, create a Seismic Surge token.\nAt the beginning of your action phase, destroy Strength of Sequoia then the next attack action card you play this turn gains +3{p}.",
    typeText: "Elemental Guardian Action - Aura",
  },
});
export const {
  red: strengthOfSequoiaRedI18n,
  yellow: strengthOfSequoiaYellowI18n,
  blue: strengthOfSequoiaBlueI18n,
} = strengthOfSequoiaI18n.cards;
