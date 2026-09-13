import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scrapHarvester } from "./scrap-harvester.ts";

export const scrapHarvesterI18n = defineFamilyI18n(scrapHarvester, {
  en: {
    name: "Scrap Harvester",
    text: "Scrap\nWhen this attacks, if it scrapped a card, put a steam counter on an item you control with crank.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: scrapHarvesterRedI18n,
  yellow: scrapHarvesterYellowI18n,
  blue: scrapHarvesterBlueI18n,
} = scrapHarvesterI18n.cards;
