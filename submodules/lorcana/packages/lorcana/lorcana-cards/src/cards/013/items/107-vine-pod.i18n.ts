import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const vinePodI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Vine Pod",
    text: [
      {
        title: "FRAGILE HUSK",
        description: "This item enters play exerted.",
      },
      {
        title: "REGENERATE",
        description:
          "{E}, 1{I} — Banish chosen character of yours. You may play a character with the same name as that character for free.",
      },
    ],
  },
  de: {
    name: "Rankenschote",
    text: [
      {
        title: "Zerbrechliche Schale",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
      {
        title: "Regenerieren",
        description:
          "{E}, 1 {I} — Wähle und verbanne einen deiner Charaktere. Du darfst einen gleichnamigen Charakter kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Bulbe de la plante",
    text: [
      {
        title: "Cosse fragile",
        description: "Cet objet entre en jeu épuisé.",
      },
      {
        title: "Régénérer",
        description:
          "{E}, 1 {I} — Choisissez l'un de vos personnages et bannissez-le. Vous pouvez jouer gratuitement un personnage portant le même nom que le personnage banni.",
      },
    ],
  },
  it: {
    name: "Baccello del Viticcio",
    text: [
      {
        title: "Guscio Fragile",
        description: "Questo oggetto entra in gioco impegnato.",
      },
      {
        title: "Rigenerazione",
        description:
          "{E}, 1 {I} — Esilia un tuo personaggio a tua scelta. Puoi giocare un personaggio con lo stesso nome di quel personaggio, gratis.",
      },
    ],
  },
};
