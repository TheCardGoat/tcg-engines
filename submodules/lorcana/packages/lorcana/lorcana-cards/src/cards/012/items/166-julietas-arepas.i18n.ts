import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const julietasArepasI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Julieta's Arepas",
    text: [
      {
        title: "FLAVORFUL CURE",
        description:
          "At the start of your turn, if you have a Madrigal character in play, remove up to 2 damage from chosen character.",
      },
      {
        title: "THAT DID THE TRICK",
        description: "{E} — If you removed damage from a character this turn, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Julietas Arepas",
    text: [
      {
        title: "Schmackhafte Heilung",
        description:
          "Zu Beginn deines Zuges, wenn du mindestens einen Madrigal im Spiel hast, entferne bis zu 2 Schaden von einem Charakter deiner Wahl.",
      },
      {
        title: "Das hat funktioniert",
        description:
          "{E} — Falls du in diesem Zug Schaden von einem deiner Charaktere entfernt hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Arepas de Julieta",
    text: [
      {
        title: "Remède savoureux",
        description:
          "Au début de votre tour, si vous avez un personnage Madrigal en jeu, choisissez un personnage et retirez jusqu'à 2 de ses dommages.",
      },
      {
        title: "Ça a fait l'affaire",
        description:
          "{E} — Si vous avez retiré des dommages d'un personnage ce tour-ci, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Arepas di Julieta",
    text: [
      {
        title: "Cura Saporita",
        description:
          "All'inizio del tuo turno, se hai in gioco un personaggio Madrigal, rimuovi fino a 2 danni da un personaggio a tua scelta.",
      },
      {
        title: "Ecco Fatto",
        description:
          "{E} — Se hai rimosso danno da un personaggio in questo turno, ottieni 1 leggenda.",
      },
    ],
  },
};
