import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sonataDystopia } from "./sonata-dystopia.ts";
const textByColor = {
  blue: 'As an additional cost to play this, destroy X Runechants you control.\nThe next attack action card you play this turn costs {x} less to play and gets +X{p}, overpower, and "When this hits, create X Runechant tokens." Go again',
} as const;
export const sonataDystopiaI18n = defineFamilyI18n(sonataDystopia, {
  en: {
    name: "Sonata Dystopia",
    typeText: "Runeblade Action",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { blue: sonataDystopiaBlueI18n } = sonataDystopiaI18n.cards;
