import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { fatigueShot } from "./fatigue-shot.ts";

export const fatigueShotI18n = defineFamilyI18n(fatigueShot, {
  en: {
    name: "Fatigue Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "When Fatigue Shot hits a hero, the base {p} of the first attack action card they play during their next turn is halved, rounded up.",
  },
});

export const {
  red: fatigueShotRedI18n,
  yellow: fatigueShotYellowI18n,
  blue: fatigueShotBlueI18n,
} = fatigueShotI18n.cards;
