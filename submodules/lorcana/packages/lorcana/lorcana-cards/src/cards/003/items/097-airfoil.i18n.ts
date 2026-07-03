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
        title: "Ich muss jetzt gehen",
        description:
          "{E} — Falls du in diesem Zug mindestens 2 Aktionen ausgespielt hast, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Aéro-surf",
    text: [
      {
        title: "Il faut que j'y aille",
        description:
          "{E} — Si vous avez joué au moins 2 cartes Action durant votre tour, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Surf Aereo",
    text: [
      {
        title: "Io Allora Vado",
        description: "{E} — Se hai giocato 2 o più azioni in questo turno, pesca 1 carta.",
      },
    ],
  },
};
