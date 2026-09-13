import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { junkyardDogg } from "./junkyard-dogg.ts";

export const junkyardDoggI18n = defineFamilyI18n(junkyardDogg, {
  en: {
    name: "Junkyard Dogg",
    text: "Scrap\nWhen this attacks, if it scrapped a card, this gets +1{p}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: junkyardDoggRedI18n,
  yellow: junkyardDoggYellowI18n,
  blue: junkyardDoggBlueI18n,
} = junkyardDoggI18n.cards;
