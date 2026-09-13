import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wither } from "./wither.ts";

export const witherI18n = defineFamilyI18n(wither, {
  en: {
    name: "Wither",
    text: "Stealth\nWhen this hits a hero, create a Frailty token under their control.",
    typeText: "Assassin Action - Attack",
  },
});
export const {
  red: witherRedI18n,
  yellow: witherYellowI18n,
  blue: witherBlueI18n,
} = witherI18n.cards;
