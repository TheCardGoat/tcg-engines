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
        title: "DAS RINGEN UM MACHT",
        description: "Könige und Königinnen können nicht erkunden.",
      },
      {
        title: "WACHSENDER EINFLUSS",
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
        title: "LUTTE POUR LE POUVOIR",
        description: "Les personnages Roi et Reine ne peuvent pas être envoyé à l'aventure.",
      },
      {
        title: "INFLUENCE GRANDISSANTE",
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
        title: "SGOMITARE PER IL POTERE I",
        description: "personaggi Re e Regina non possono andare all'avventura.",
      },
      {
        title: "INFLUENZA CRESCENTE",
        description:
          "All'inizio del tuo turno, se un avversario ha in gioco 2 o più personaggi preparati, ottieni 2 leggenda.",
      },
    ],
  },
};
