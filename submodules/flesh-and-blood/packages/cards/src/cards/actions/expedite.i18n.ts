import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { expedite } from "./expedite.ts";

export const expediteI18n = defineFamilyI18n(expedite, {
  en: {
    name: "Expedite",
    text: "Boost\nWhen this hits, you may put an item with cost 0 or 1 from your hand into the arena.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: expediteRedI18n,
  yellow: expediteYellowI18n,
  blue: expediteBlueI18n,
} = expediteI18n.cards;
