import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cutThrough } from "./cut-through.ts";

export const cutThroughI18n = defineFamilyI18n(cutThrough, {
  en: {
    name: "Cut Through",
    text: "If you've hit with a dagger this combat chain, this gets +1{p} and go again.",
    typeText: "Assassin / Ninja Action - Attack",
  },
});
export const {
  red: cutThroughRedI18n,
  yellow: cutThroughYellowI18n,
  blue: cutThroughBlueI18n,
} = cutThroughI18n.cards;
