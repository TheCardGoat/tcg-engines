import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flusterFist } from "./fluster-fist.ts";

export const flusterFistI18n = defineFamilyI18n(flusterFist, {
  en: {
    name: "Fluster Fist",
    typeText: "Ninja Action - Attack",
    text: "Combo - If Open the Center was the last attack this combat chain, Fluster Fist gains +1{p} for each attack that has hit this combat chain.",
  },
});

export const {
  red: flusterFistRedI18n,
  yellow: flusterFistYellowI18n,
  blue: flusterFistBlueI18n,
} = flusterFistI18n.cards;
