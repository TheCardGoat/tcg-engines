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
        title: "WIR SIND IN DER ÜBERZAHL",
        description:
          "Solange du mindestens 3 Welpen im Spiel hast, erhält dieser Charakter +2 und +2.",
      },
    ],
  },
  fr: {
    name: "Le Colonel",
    version: "Vieux chien de berger",
    text: [
      {
        title: "ILS SONT LOIN D'AVOIR NOS EFFECTIFS",
        description:
          "Tant que vous avez 3 personnages Chiot en jeu ou plus, ce personnage-ci gagne +2 et +2.",
      },
    ],
  },
  it: {
    name: "Il Colonnello",
    version: "Vecchio Cane Pastore",
    text: [
      {
        title: "SIAMO SUPERIORI DI NUMERO",
        description:
          "Mentre hai in gioco 3 o più personaggi Cucciolo, questo personaggio riceve +2 e +2.",
      },
    ],
  },
};
