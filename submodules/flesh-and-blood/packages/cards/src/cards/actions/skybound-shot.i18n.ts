import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { skyboundShot } from "./skybound-shot.ts";

export const skyboundShotI18n = defineFamilyI18n(skyboundShot, {
  en: {
    name: "Skybound Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Skybound Shot has an aim counter, it has +1{p}.",
  },
});

export const {
  red: skyboundShotRedI18n,
  yellow: skyboundShotYellowI18n,
  blue: skyboundShotBlueI18n,
} = skyboundShotI18n.cards;
