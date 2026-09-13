import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { deathTouch } from "./death-touch.ts";

export const deathTouchI18n = defineFamilyI18n(deathTouch, {
  en: {
    name: "Death Touch",
    text: "Death Touch can't be played from hand.\nWhen this hits a hero, create a Frailty, Inertia, or Bloodrot Pox token under their control.",
    typeText: "Assassin / Ranger Action - Attack",
  },
});

export const {
  red: deathTouchRedI18n,
  yellow: deathTouchYellowI18n,
  blue: deathTouchBlueI18n,
} = deathTouchI18n.cards;
