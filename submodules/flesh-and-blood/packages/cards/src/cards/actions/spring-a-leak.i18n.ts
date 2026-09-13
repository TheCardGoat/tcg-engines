import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { springALeak } from "./spring-a-leak.ts";

export const springALeakI18n = defineFamilyI18n(springALeak, {
  en: {
    name: "Spring a Leak",
    text: "Boost\nWhen this hits a hero, remove all steam counters from an equipment, item, or weapon they control.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: springALeakRedI18n,
  yellow: springALeakYellowI18n,
  blue: springALeakBlueI18n,
} = springALeakI18n.cards;
