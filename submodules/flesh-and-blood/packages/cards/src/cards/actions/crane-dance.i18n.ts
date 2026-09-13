import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { craneDance } from "./crane-dance.ts";

export const craneDanceI18n = defineFamilyI18n(craneDance, {
  en: {
    name: "Crane Dance",
    typeText: "Ninja Action - Attack",
    text: "Combo - If Soulbead Strike was the last attack this combat chain, Crane Dance gains +1{p}, go again, and it can't be defended by attack action cards with base {p} greater than the number of chain links you control.",
  },
});

export const {
  red: craneDanceRedI18n,
  yellow: craneDanceYellowI18n,
  blue: craneDanceBlueI18n,
} = craneDanceI18n.cards;
