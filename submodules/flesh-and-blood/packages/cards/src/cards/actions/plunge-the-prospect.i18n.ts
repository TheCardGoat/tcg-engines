import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { plungeTheProspect } from "./plunge-the-prospect.ts";

export const plungeTheProspectI18n = defineFamilyI18n(plungeTheProspect, {
  en: {
    name: "Plunge the Prospect",
    text: "Stealth\nIf this is attacking a marked hero, this gets +1{p}.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: plungeTheProspectRedI18n,
  yellow: plungeTheProspectYellowI18n,
  blue: plungeTheProspectBlueI18n,
} = plungeTheProspectI18n.cards;
