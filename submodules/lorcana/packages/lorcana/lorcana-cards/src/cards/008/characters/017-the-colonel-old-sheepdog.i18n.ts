import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theColonelOldSheepdogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Colonel",
    version: "Old Sheepdog",
    text: [
      {
        title: "WE'VE GOT 'EM OUTNUMBERED",
        description:
          "While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
      },
    ],
  },
  de: {
    name: "Colonel",
    version: "Alter Hütehund",
    text: [
      {
        title: "Wir sind in der Überzahl",
        description:
          "Solange du mindestens 3 Welpen im Spiel hast, erhält dieser Charakter +2 {S} und +2 {L}.",
      },
    ],
  },
  fr: {
    name: "Le Colonel",
    version: "Vieux chien de berger",
    text: [
      {
        title: "Ils sont loin d'avoir nos effectifs",
        description:
          "Tant que vous avez 3 personnages Chiot en jeu ou plus, ce personnage-ci gagne +2 {S} et +2 {L}.",
      },
    ],
  },
  it: {
    name: "Il Colonnello",
    version: "Vecchio Cane Pastore",
    text: [
      {
        title: "Siamo Superiori di Numero",
        description:
          "Mentre hai in gioco 3 o più personaggi Cucciolo, questo personaggio riceve +2 {S} e +2 {L}.",
      },
    ],
  },
};
