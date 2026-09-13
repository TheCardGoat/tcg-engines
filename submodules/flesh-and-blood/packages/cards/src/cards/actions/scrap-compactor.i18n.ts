import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { scrapCompactor } from "./scrap-compactor.ts";

export const scrapCompactorI18n = defineFamilyI18n(scrapCompactor, {
  en: {
    name: "Scrap Compactor",
    text: "Scrap\nWhen this attacks, if it scrapped a card, you may play your next Evo this turn as though it were an instant.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: scrapCompactorRedI18n,
  yellow: scrapCompactorYellowI18n,
  blue: scrapCompactorBlueI18n,
} = scrapCompactorI18n.cards;
