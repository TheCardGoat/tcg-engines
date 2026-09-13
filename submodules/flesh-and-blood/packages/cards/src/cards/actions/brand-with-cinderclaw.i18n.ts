import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { brandWithCinderclaw } from "./brand-with-cinderclaw.ts";

export const brandWithCinderclawI18n = defineFamilyI18n(brandWithCinderclaw, {
  en: {
    name: "Brand with Cinderclaw",
    text: "Your next attack this combat chain is Draconic in addition to its other card types.\nGo again",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: brandWithCinderclawRedI18n,
  yellow: brandWithCinderclawYellowI18n,
  blue: brandWithCinderclawBlueI18n,
} = brandWithCinderclawI18n.cards;
