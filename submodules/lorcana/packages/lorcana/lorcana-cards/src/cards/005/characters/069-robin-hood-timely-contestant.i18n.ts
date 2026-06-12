import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const robinHoodTimelyContestantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Robin Hood",
    version: "Timely Contestant",
    text: [
      {
        title: "TAG ME IN!",
        description:
          "For each 1 damage on opposing characters, you pay 1 {I} less to play this character.",
      },
      {
        title: "Ward",
      },
    ],
  },
  de: {
    name: "Robin Hood",
    version: "Rechtzeitiger Teilnehmer",
    text: [
      {
        title: "ICH BIN DRAN!",
        description:
          "Für jeden Schaden auf gegnerischen Charakteren, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Behütet",
      },
    ],
  },
  fr: {
    name: "Robin des Bois",
    version: "Candidat opportun",
    text: [
      {
        title: "J'ARRIVE!",
        description:
          "Jouer ce personnage vous coûte 1 de moins par dommage sur les personnages adverses.",
      },
      {
        title: "Hors d'atteinte",
      },
    ],
  },
  it: {
    name: "Robin Hood",
    version: "Concorrente Tempestivo",
    text: [
      {
        title: "MANDAMI IN CAMPO!",
        description:
          "Per ogni singolo danno sui personaggi avversari, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "Protetto",
      },
    ],
  },
};
