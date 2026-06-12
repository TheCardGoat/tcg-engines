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
        title: "DEN PUNKT NEHMEN",
        description: "Solange ein beschädigter Charakter im Spiel ist, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Gardes cartes",
    version: "Troupes royales",
    text: [
      {
        title: "PRENDRE POSITION",
        description: "Tant qu'un personnage a au moins un dommage, ce personnage-ci gagne +2.",
      },
    ],
  },
  it: {
    name: "Carte Soldato",
    version: "Truppe Reali",
    text: [
      {
        title: "PRENDERE IL COMANDO",
        description: "Mentre un personaggio danneggiato è in gioco, questo personaggio riceve +2.",
      },
    ],
  },
};
