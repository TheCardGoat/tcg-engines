import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ebbingArcstride } from "./ebbing-arcstride.ts";

export const ebbingArcstrideI18n = defineFamilyI18n(ebbingArcstride, {
  en: {
    name: "Ebbing Arcstride",
    typeText: "Lightning Illusionist Action - Attack",
    text: "Whenever this fragments, it gets go again.\nFragment",
  },
});

export const {
  red: ebbingArcstrideRedI18n,
  yellow: ebbingArcstrideYellowI18n,
  blue: ebbingArcstrideBlueI18n,
} = ebbingArcstrideI18n.cards;
