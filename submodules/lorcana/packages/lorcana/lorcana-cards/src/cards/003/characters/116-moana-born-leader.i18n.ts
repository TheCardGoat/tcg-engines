import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const moanaBornLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Moana",
    version: "Born Leader",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "WELCOME TO MY BOAT",
        description:
          "Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Vaiana",
    version: "Geborene Anführerin",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "WILLKOMMEN AUF MEINEM BOOT",
        description:
          "Jedes Mal, wenn dieser Charakter an einem Ort erkundet, mache alle deine anderen Charaktere an diesem Ort bereit. Sie können in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Vaiana",
    version: "Cheffe née",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "BIENVENUE SUR MON BATEAU",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure depuis un lieu, redressez tous les autres personnages qui s'y trouvent. Ils ne peuvent pas être envoyés à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Vaiana",
    version: "Leader Nata",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "BENVENUTO SULLA MIA BARCA",
        description:
          "Ogni volta che questo personaggio va all'avventura mentre si trova in un luogo, prepara tutti gli altri personaggi in quel luogo. Non possono andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
