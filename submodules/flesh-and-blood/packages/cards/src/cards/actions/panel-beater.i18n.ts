import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { panelBeater } from "./panel-beater.ts";

export const panelBeaterI18n = defineFamilyI18n(panelBeater, {
  en: {
    name: "Panel Beater",
    text: "Boost\nThis gets +X{p}, where X is the number of equipment defending it.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: panelBeaterRedI18n,
  yellow: panelBeaterYellowI18n,
  blue: panelBeaterBlueI18n,
} = panelBeaterI18n.cards;
