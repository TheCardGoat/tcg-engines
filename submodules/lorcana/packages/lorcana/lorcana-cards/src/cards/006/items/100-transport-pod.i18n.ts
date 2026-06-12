import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const transportPodI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Transport Pod",
    text: [
      {
        title: "GIVE 'EM A SHOW",
        description:
          "At the start of your turn, you may move a character of yours to a location for free.",
      },
    ],
  },
  de: {
    name: "Transportkapsel",
    text: [
      {
        title: "JETZT BEKOMMEN SIE IHRE SHOW",
        description:
          "Zu Beginn deines Zuges, darfst du einen deiner Charaktere wählen und ihn kostenlos zu einem Ort bewegen.",
      },
    ],
  },
  fr: {
    name: "Module de transport",
    text: [
      {
        title: "ILS MÉRITENT UNE DÉMONSTRATION",
        description:
          "Au début de votre tour, vous pouvez déplacer gratuitement l'un de vos personnages sur un lieu.",
      },
    ],
  },
  it: {
    name: "Capsula di Trasporto",
    text: [
      {
        title: "UN BELLO SPETTACOLO",
        description:
          "All'inizio del tuo turno, puoi spostare un tuo personaggio in un luogo, gratis.",
      },
    ],
  },
};
