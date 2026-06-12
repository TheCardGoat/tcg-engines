import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const liloSnowArtistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lilo",
    version: "Snow Artist",
    text: [
      {
        title: "CREATIVE INSPIRATION",
        description: "While you have a character named Stitch in play, this character gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Lilo",
    version: "Schneekünstlerin",
    text: [
      {
        title: "KREATIVE INSPIRATION",
        description:
          "Solange du mindestens einen Stitch-Charakter im Spiel hast, erhält dieser Charakter +1.",
      },
    ],
  },
  fr: {
    name: "Lilo",
    version: "Artiste de la neige",
    text: [
      {
        title: "INSPIRATION CRÉATIVE",
        description: "Tant que vous avez un personnage Stitch en jeu, ce personnage-ci gagne +1.",
      },
    ],
  },
  it: {
    name: "Lilo",
    version: "Artista della Neve",
    text: [
      {
        title: "ISPIRAZIONE CREATIVA",
        description:
          "Mentre hai in gioco un personaggio chiamato Stitch, questo personaggio riceve +1.",
      },
    ],
  },
};
