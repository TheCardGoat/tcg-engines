import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cardSoldiersRoyalTroopsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Card Soldiers",
    version: "Royal Troops",
    text: [
      {
        title: "TAKE POINT",
        description: "While a damaged character is in play, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Kartensoldaten",
    version: "Königliche Truppen",
    text: [
      {
        title: "Den Punkt nehmen",
        description:
          "Solange ein beschädigter Charakter im Spiel ist, erhält dieser Charakter +2 {S}.",
      },
    ],
  },
  fr: {
    name: "Gardes cartes",
    version: "Troupes royales",
    text: [
      {
        title: "Prendre position",
        description: "Tant qu'un personnage a au moins un dommage, ce personnage-ci gagne +2 {S}.",
      },
    ],
  },
  it: {
    name: "Carte Soldato",
    version: "Truppe Reali",
    text: [
      {
        title: "Prendere il Comando",
        description:
          "Mentre un personaggio danneggiato è in gioco, questo personaggio riceve +2 {S}.",
      },
    ],
  },
  es: {
    name: "Soldados de cartas",
    version: "Tropas reales",
    text: [
      {
        title: "TOMAR PUNTO",
        description: "Mientras un personaje dañado esté en juego, este personaje obtiene +2 {S}.",
      },
    ],
  },
};
