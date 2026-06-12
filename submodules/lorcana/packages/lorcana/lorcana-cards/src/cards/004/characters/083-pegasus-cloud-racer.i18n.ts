import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pegasusCloudRacerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pegasus",
    version: "Cloud Racer",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Evasive",
      },
      {
        title: "HOP ON!",
        description:
          "When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Pegasus",
    version: "Wolkenflitzer",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "Wendig",
      },
      {
        title: "SPRING AUF!",
        description:
          "Falls du Gestaltwandel benutzt hast, um diesen Charakter auszuspielen, erhalten deine Charaktere bis zu Beginn deines nächsten Zuges Wendig.",
      },
    ],
  },
  fr: {
    name: "Pégase",
    version: "Fait la course aux nuages",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "Insaisissable",
      },
      {
        title: "EN SELLE!",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité Alter, vos personnages gagnent Insaisissable jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Pegaso",
    version: "Calcanuvole",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "Sfuggente",
      },
      {
        title: "SALTA SU!",
        description:
          "Quando giochi questo personaggio, se hai usato Trasformazione per giocarlo, i tuoi personaggi ottengono Sfuggente fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
