import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const crikeePartOfTheTeamI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cri-Kee",
    version: "Part of the Team",
    text: [
      {
        title: "AT HER SIDE",
        description:
          "While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Kriki",
    version: "Teil des Teams",
    text: [
      {
        title: "AN IHRER SEITE",
        description:
          "Solange du mindestens 2 andere erschöpfte Charaktere im Spiel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Cri-Kee",
    version: "Membre de l'équipe",
    text: [
      {
        title: "À SES CÔTÉS",
        description:
          "Tant que vous avez 2 autres personnages épuisés ou plus en jeu, ce personnage-ci gagne +2.",
      },
    ],
  },
  it: {
    name: "Cri-Cri",
    version: "Parte della Squadra",
    text: [
      {
        title: "AL SUO FIANCO",
        description:
          "Mentre hai in gioco 2 o più altri personaggi impegnati, questo personaggio riceve +2.",
      },
    ],
  },
};
