import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { overcharge } from "./overcharge.ts";

export const overchargeI18n = defineFamilyI18n(overcharge, {
  en: {
    name: "Overcharge",
    typeText: "Lightning Action - Attack",
    text: "If you've played an instant card this chain link, this gets +3{p}.\nGo again",
  },
});

export const {
  red: overchargeRedI18n,
  yellow: overchargeYellowI18n,
  blue: overchargeBlueI18n,
} = overchargeI18n.cards;
