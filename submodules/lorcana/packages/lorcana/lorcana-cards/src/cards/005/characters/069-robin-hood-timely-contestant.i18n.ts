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
        title: "Ich bin dran!",
        description:
          "Für jeden Schaden auf gegnerischen Charakteren, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "<Behütet>",
      },
    ],
  },
  fr: {
    name: "Robin des Bois",
    version: "Candidat opportun",
    text: [
      {
        title: "J'arrive!",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins par dommage sur les personnages adverses.",
      },
      {
        title: "<Hors d'atteinte>",
      },
    ],
  },
  it: {
    name: "Robin Hood",
    version: "Concorrente Tempestivo",
    text: [
      {
        title: "Mandami in Campo!",
        description:
          "Per ogni singolo danno sui personaggi avversari, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "<Protetto>",
      },
    ],
  },
  es: {
    name: "Robin Hood",
    version: "Concursante oportuno",
    text: [
      {
        title: "¡ETIQUETAME!",
        description:
          "Por cada 1 daño en personajes contrarios, pagas 1 {I} menos para interpretar a este personaje.",
      },
      {
        title: "Pabellón",
      },
    ],
  },
};
