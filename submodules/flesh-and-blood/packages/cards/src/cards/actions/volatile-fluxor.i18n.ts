import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { volatileFluxor } from "./volatile-fluxor.ts";

export const volatileFluxorI18n = defineFamilyI18n(volatileFluxor, {
  en: {
    name: "Volatile Fluxor",
    typeText: "Lightning Action - Attack",
    text: "If you've played an instant card this chain link, this gets +3{p}.\nWhen this hits, create a Lightning Flow token.\nGo again",
  },
});

export const {
  red: volatileFluxorRedI18n,
  yellow: volatileFluxorYellowI18n,
  blue: volatileFluxorBlueI18n,
} = volatileFluxorI18n.cards;
