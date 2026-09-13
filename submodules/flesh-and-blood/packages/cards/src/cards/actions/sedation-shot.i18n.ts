import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sedationShot } from "./sedation-shot.ts";

export const sedationShotI18n = defineFamilyI18n(sedationShot, {
  en: {
    name: "Sedation Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Sedation Shot has an aim counter, it has +1{p}.\nWhen this hits a hero, create an Inertia token under their control.",
  },
});

export const {
  red: sedationShotRedI18n,
  yellow: sedationShotYellowI18n,
  blue: sedationShotBlueI18n,
} = sedationShotI18n.cards;
