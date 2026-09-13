import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scrapHopper } from "./scrap-hopper.ts";

export const scrapHopperI18n = defineFamilyI18n(scrapHopper, {
  en: {
    name: "Scrap Hopper",
    text: "Scrap\nWhen this attacks, if it scrapped a card, create a Quicken token.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: scrapHopperRedI18n,
  yellow: scrapHopperYellowI18n,
  blue: scrapHopperBlueI18n,
} = scrapHopperI18n.cards;
