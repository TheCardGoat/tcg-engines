import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { knifeThrough } from "./knife-through.ts";

export const knifeThroughI18n = defineFamilyI18n(knifeThrough, {
  en: {
    name: "Knife Through",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nIf you've hit with a dagger this combat chain, this gets go again.",
  },
});

export const {
  red: knifeThroughRedI18n,
  yellow: knifeThroughYellowI18n,
  blue: knifeThroughBlueI18n,
} = knifeThroughI18n.cards;
