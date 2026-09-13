import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { digIn } from "./dig-in.ts";

export const digInI18n = defineFamilyI18n(digIn, {
  en: {
    name: "Dig In",
    text: "When this defends, you may pay up to {r}{r}{r}. Create that many Toughness tokens.",
    typeText: "Revered Action - Attack",
  },
});
export const { red: digInRedI18n, yellow: digInYellowI18n, blue: digInBlueI18n } = digInI18n.cards;
