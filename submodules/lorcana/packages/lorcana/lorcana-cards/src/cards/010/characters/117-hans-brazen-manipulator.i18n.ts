import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hansBrazenManipulatorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hans",
    version: "Brazen Manipulator",
    text: [
      {
        title: "JOSTLING FOR POWER",
        description: "King and Queen characters can't quest.",
      },
      {
        title: "GROWING INFLUENCE",
        description:
          "At the start of your turn, if an opponent has 2 or more ready characters in play, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Hans",
    version: "Unverschämter Manipulator",
    text: [
      {
        title: "Das Ringen um Macht",
        description: "Könige und Königinnen können nicht erkunden.",
      },
      {
        title: "Wachsender Einfluss",
        description:
          "Zu Beginn deines Zuges, wenn mindestens eine gegnerische Person 2 oder mehr bereite Charaktere im Spiel hat, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Hans",
    version: "Manipulateur éhonté",
    text: [
      {
        title: "Lutte pour le pouvoir",
        description: "Les personnages Roi et Reine ne peuvent pas être envoyé à l'aventure.",
      },
      {
        title: "Influence grandissante",
        description:
          "Au début de votre tour, si un adversaire a 2 personnages redressés ou plus en jeu, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Hans",
    version: "Manipolatore Sfacciato",
    text: [
      {
        title: "Sgomitare per il Potere",
        description: "I personaggi Re e Regina non possono andare all'avventura.",
      },
      {
        title: "Influenza Crescente",
        description:
          "All'inizio del tuo turno, se un avversario ha in gioco 2 o più personaggi preparati, ottieni 2 leggenda.",
      },
    ],
  },
  es: {
    name: "Hans",
    version: "Manipulador descarado",
    text: [
      {
        title: "EMPUJANDO POR EL PODER",
        description: "Los personajes del Rey y la Reina no pueden realizar misiones.",
      },
      {
        title: "INFLUENCIA CRECIENTE",
        description:
          "Al comienzo de tu turno, si un oponente tiene 2 o más personajes listos en juego, gana 2 conocimientos.",
      },
    ],
  },
};
