import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const instituteOfTechnologyPrestigiousUniversityI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Institute of Technology",
    version: "Prestigious University",
    text: [
      {
        title: "WELCOME TO THE LAB",
        description: "Inventor characters get +1 {W} while here.",
      },
      {
        title: "PUSH THE BOUNDARIES",
        description: "At the start of your turn, if you have a character here, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Institut für Technologie",
    version: "Renommierte Universität",
    text: [
      {
        title: "WILLKOMMEN IM LABOR",
        description: "Erfinder an diesem Ort erhalten +1.",
      },
      {
        title: "WIR ÜBERWINDEN DIE GRENZEN",
        description:
          "Zu Beginn deines Zuges, wenn du mindestens einen Charakter an diesem Ort hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Institut de Technologie",
    version: "Prestigieuse faculté",
    text: [
      {
        title: "BIENVENUE AU LABO DES INTELLOS",
        description: "Les personnages Inventeur sur ce lieu gagnent +1.",
      },
      {
        title: "REPOUSSONS LES LIMITES",
        description:
          "Au début de votre tour, si vous avez un personnage sur ce lieu, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Istituto Tecnologico",
    version: "Università Prestigiosa",
    text: [
      {
        title: "BENVENUTO AL LABORATORIO I",
        description: "personaggi Inventore ricevono +1 mentre si trovano in questo luogo.",
      },
      {
        title: "AVANGUARDIA DELLA ROBOTICA",
        description:
          "All'inizio del tuo turno, se hai un personaggio in questo luogo, ottieni 1 leggenda.",
      },
    ],
  },
};
