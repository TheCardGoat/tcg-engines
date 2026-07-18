import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const luckyDimeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lucky Dime",
    text: [
      {
        title: "NUMBER ONE",
        description: "{E}, 2 {I} — Choose a character of yours and gain lore equal to their {L}.",
      },
    ],
  },
  de: {
    name: "Glückskreuzer",
    text: [
      {
        title: "Nummer Eins",
        description:
          "{E}, 2 {I} — Wähle einen deiner Charaktere und sammle so viele Legenden, wie sein {L}-Wert beträgt.",
      },
    ],
  },
  fr: {
    name: "Sou fétiche",
    text: [
      {
        title: "Premier sou",
        description:
          "{E}, 2 {I} — Choisissez l'un de vos personnages et gagnez un nombre d'éclats de Lore égal à sa {L}.",
      },
    ],
  },
  it: {
    name: "Numero Uno",
    text: [
      {
        title: "Decino Fortunato",
        description:
          "{E}, 2 {I} — Scegli uno dei tuoi personaggi e ottieni leggenda pari al suo {L}.",
      },
    ],
  },
  es: {
    name: "Moneda de diez centavos de la suerte",
    text: [
      {
        title: "NÚMERO UNO",
        description: "{E}, 2 {I}: elige un personaje tuyo y obtén una tradición igual a su {L}.",
      },
    ],
  },
};
