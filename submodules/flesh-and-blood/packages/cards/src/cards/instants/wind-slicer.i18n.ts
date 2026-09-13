import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { windSlicer } from "./wind-slicer.ts";

export const windSlicerI18n = defineFamilyI18n(windSlicer, {
  en: {
    name: "Wind Slicer",
    typeText: "Ninja Instant - Shuriken Item",
    text: "Legendary\nAction - {r}, {t}, destroy this when the combat chain closes: Attack. Go again\nWhen this hits a hero, they lose all hero card abilities during their next action phase",
  },
});

export const { blue: windSlicerBlueI18n } = windSlicerI18n.cards;
