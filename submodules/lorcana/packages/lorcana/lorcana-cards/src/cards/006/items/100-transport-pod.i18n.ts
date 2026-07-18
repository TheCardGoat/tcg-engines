import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const transportPodI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Transport Pod",
    text: [
      {
        title: "GIVE 'EM",
        description:
          "A SHOW At the start of your turn, you may move a character of yours to a location for free.",
      },
    ],
  },
  de: {
    name: "Transportkapsel",
    text: [
      {
        title: "Jetzt bekommen sie ihre Show",
        description:
          "Zu Beginn deines Zuges, darfst du einen deiner Charaktere wählen und ihn kostenlos zu einem Ort bewegen.",
      },
    ],
  },
  fr: {
    name: "Module de transport",
    text: [
      {
        title: "Ils méritent une démonstration",
        description:
          "Au début de votre tour, vous pouvez déplacer gratuitement l'un de vos personnages sur un lieu.",
      },
    ],
  },
  it: {
    name: "Capsula di Trasporto",
    text: [
      {
        title: "Un Bello Spettacolo",
        description:
          "All'inizio del tuo turno, puoi spostare un tuo personaggio in un luogo, gratis.",
      },
    ],
  },
  es: {
    name: "Cápsula de transporte",
    text: [
      {
        title: "DÉLOS",
        description:
          "UN ESPECTÁCULO Al comienzo de tu turno, puedes mover un personaje tuyo a una ubicación de forma gratuita.",
      },
    ],
  },
};
