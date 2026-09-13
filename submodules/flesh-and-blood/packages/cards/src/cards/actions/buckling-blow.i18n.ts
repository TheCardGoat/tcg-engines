import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bucklingBlow } from "./buckling-blow.ts";

export const bucklingBlowI18n = defineFamilyI18n(bucklingBlow, {
  en: {
    name: "Buckling Blow",
    text: "Crush - When this deals 4 or more damage to a hero, put a -1{d} counter on target equipment they control.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: bucklingBlowRedI18n,
  yellow: bucklingBlowYellowI18n,
  blue: bucklingBlowBlueI18n,
} = bucklingBlowI18n.cards;
