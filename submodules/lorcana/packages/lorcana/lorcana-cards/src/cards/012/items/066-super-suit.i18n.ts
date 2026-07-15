import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const superSuitI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Super Suit",
    text: [
      {
        title: "SIMPLE, ELEGANT",
        description: "When you play this item, if you have a Hero character in play, gain 1 lore.",
      },
      {
        title: "SUIT UP",
        description: "{E}, 2 {I} — If you played a Hero character this turn, draw a card.",
      },
    ],
  },
  de: {
    name: "Superanzug",
    text: [
      {
        title: "Schlicht und elegant",
        description:
          "Wenn du diesen Gegenstand ausspielst, falls du mindestens einen Helden im Spiel hast, sammelst du 1 Legende.",
      },
      {
        title: "Ankleiden",
        description:
          "{E}, 2 {I} — Falls du in diesem Zug mindestens einen Helden ausgespielt hast, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Super-costume",
    text: [
      {
        title: "Simple, élégant",
        description:
          "Lorsque vous jouez cet objet, si vous avez un personnage Héros en jeu, gagnez 1 éclat de Lore.",
      },
      {
        title: "Enfiler son costume",
        description:
          "{E}, 2 {I} — Si vous avez joué un personnage Héros ce tour-ci, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Super Tuta",
    text: [
      {
        title: "Semplice, Elegante",
        description:
          "Quando giochi questo oggetto, se hai in gioco un personaggio Eroe, ottieni 1 leggenda.",
      },
      {
        title: "Prepararsi",
        description:
          "{E}, 2 {I} — Se hai giocato un personaggio Eroe in questo turno, pesca una carta.",
      },
    ],
  },
};
