import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const allIsFoundI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "All Is Found",
    text: "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
  },
  de: {
    name: "Es kommt zu dir",
    text: "Lege bis zu 2 Karten aus deinem Ablagestapel verdeckt und erschöpft in deinen Tintenvorrat.",
  },
  fr: {
    name: "La berceuse d'Ahtohallan",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 5 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Placez jusqu'à 2 cartes de votre défausse dans votre réserve d'encre, face cachée et épuisées.",
      },
    ],
  },
  it: {
    name: "Un Rifugio Ha Trovato",
    text: [
      {
        title:
          "(Un personaggio con costo 5 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Aggiungi fino a 2 carte dai tuoi scarti al tuo calamaio, a faccia in giù e impegnate.",
      },
    ],
  },
  es: {
    name: "Todo se encuentra",
    text: "Pon hasta 2 cartas de tu descarte en tu tintero, boca abajo y ejercidas.",
  },
};
