import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scrapProspector } from "./scrap-prospector.ts";

export const scrapProspectorI18n = defineFamilyI18n(scrapProspector, {
  en: {
    name: "Scrap Prospector",
    text: "Scrap\nWhen this attacks, if it scrapped a card, gain {r}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: scrapProspectorRedI18n,
  yellow: scrapProspectorYellowI18n,
  blue: scrapProspectorBlueI18n,
} = scrapProspectorI18n.cards;
