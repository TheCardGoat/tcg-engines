import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const windupFrogSidsToyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wind-Up Frog",
    version: "Sid's Toy",
    text: [
      {
        title: "ADDED TRACTION",
        description:
          "If one of your Toy characters was banished this turn, you pay 2 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Aufziehfrosch",
    version: "Sids Spielzeug",
    text: [
      {
        title: "Zusätzliche Traktion",
        description:
          "Falls eines deiner Spielzeuge in diesem Zug verbannt wurde, zahlst du 2 {I} weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "La grenouille",
    version: "Jouet de Sid",
    text: [
      {
        title: "Propulsion supplémentaire",
        description:
          "Jouer ce personnage vous coûte 2 {I} de moins si l'un de vos personnages Jouet a été banni ce tour-ci.",
      },
    ],
  },
  it: {
    name: "Rana a Carica",
    version: "Giocattolo di Sid",
    text: [
      {
        title: "Aderenza Extra",
        description:
          "Se uno dei tuoi personaggi Giocattolo è stato esiliato in questo turno, paga 2 {I} in meno per giocare questo personaggio.",
      },
    ],
  },
};
