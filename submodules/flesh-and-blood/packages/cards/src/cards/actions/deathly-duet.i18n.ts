import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { deathlyDuet } from "./deathly-duet.ts";

export const deathlyDuetI18n = defineFamilyI18n(deathlyDuet, {
  en: {
    name: "Deathly Duet",
    text: "When Deathly Duet attacks, if an attack action card was pitched to play it, it gains +2{p}. If a 'non-attack' action card was pitched to play it, create 2 Runechant tokens.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: deathlyDuetRedI18n,
  yellow: deathlyDuetYellowI18n,
  blue: deathlyDuetBlueI18n,
} = deathlyDuetI18n.cards;
