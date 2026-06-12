import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const agnarrKingOfArendelleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Agnarr",
    version: "King of Arendelle",
    text: [
      {
        title: "PROTECTIVE INSTINCT",
        description: "While you have a Queen character in play, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Agnarr",
    version: "König von Arendelle",
    text: [
      {
        title: "BESCHÜTZERINSTINKT",
        description:
          "Solange du mindestens eine Königin im Spiel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Agnarr",
    version: "Roi d'Arendelle",
    text: [
      {
        title: "INSTINCT PROTECTEUR",
        description: "Tant que vous avez un personnage Reine en jeu, ce personnage-ci gagne +2.",
      },
    ],
  },
  it: {
    name: "Agnarr",
    version: "Re di Arendelle",
    text: [
      {
        title: "ISTINTO PROTETTIVO",
        description: "Mentre hai in gioco un personaggio Regina, questo personaggio riceve +2.",
      },
    ],
  },
};
