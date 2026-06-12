import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const airfoilI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Airfoil",
    text: [
      {
        title: "I GOT TO BE GOING",
        description: "{E} — If you've played 2 or more actions this turn, draw a card.",
      },
    ],
  },
  de: {
    name: "Wolkensurfer",
    text: [
      {
        title: "ICH MUSS JETZT GEHEN",
        description:
          "— Falls du in diesem Zug mindestens 2 Aktionen ausgespielt hast, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Aéro-surf",
    text: [
      {
        title: "IL FAUT QUE J'Y AILLE",
        description:
          "— Si vous avez joué au moins 2 cartes Action durant votre tour, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Surf Aereo",
    text: [
      {
        title: "IO ALLORA VADO",
        description: "— Se hai giocato 2 o più azioni in questo turno, pesca 1 carta.",
      },
    ],
  },
};
