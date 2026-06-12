import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const johnSilverSternCaptainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "John Silver",
    version: "Stern Captain",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Resist +2",
      },
      {
        title: "DON'T JUST SIT THERE!",
        description: "At the start of your turn, deal 1 damage to each opposing ready character.",
      },
    ],
  },
  de: {
    name: "John Silver",
    version: "Strenger Kapitän",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "Robust +2",
      },
      {
        title: "SITZ NICHT EINFACH HERUM!",
        description:
          "Zu Beginn deines Zuges, füge jedem gegnerischen bereiten Charakter 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "John Silver",
    version: "Capitaine sévère",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "Résistance +2",
      },
      {
        title: "NE RESTE PAS PLANTÉ LÀ!",
        description:
          "Au début de votre tour, infligez 1 dommage à chaque personnage adverse redressé.",
      },
    ],
  },
  it: {
    name: "John Silver",
    version: "Capitano Severo",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "Resistere +2",
      },
      {
        title: "NON STARTENE LÌ IMPALATO!",
        description:
          "All'inizio del tuo turno, infliggi 1 danno a ogni personaggio avversario preparato.",
      },
    ],
  },
};
