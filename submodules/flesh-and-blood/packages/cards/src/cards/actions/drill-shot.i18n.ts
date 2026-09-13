import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { drillShot } from "./drill-shot.ts";

export const drillShotI18n = defineFamilyI18n(drillShot, {
  en: {
    name: "Drill Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Drill Shot has an aim counter, it has piercing 1.\nWhen this hits a hero, put a -1{d} counter on an equipment they control.",
  },
});

export const {
  red: drillShotRedI18n,
  yellow: drillShotYellowI18n,
  blue: drillShotBlueI18n,
} = drillShotI18n.cards;
