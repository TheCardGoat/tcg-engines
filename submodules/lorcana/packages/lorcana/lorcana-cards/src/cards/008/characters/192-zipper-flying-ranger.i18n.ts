import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const zipperFlyingRangerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Zipper",
    version: "Flying Ranger",
    text: [
      {
        title: "BEST MATES",
        description:
          "If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.",
      },
      {
        title: "BURST OF SPEED",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
    ],
  },
  de: {
    name: "Summi",
    version: "Fliegender Ritter des Rechts",
    text: [
      {
        title: "BESTE KUMPEL",
        description:
          "Wenn du einen Samson-Charakter im Spiel hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "GESCHWINDIGKEITSSCHUB",
        description:
          "In deinem Zug erhält dieser Charakter Wendig. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Ruzor",
    version: "Ranger volant",
    text: [
      {
        title: "MEILLEURS COPAINS",
        description:
          "Jouer ce personnage vous coûte 1 de moins si vous avez un personnage Jack le Costaud en jeu.",
      },
      {
        title: "ACCÉLÉRATION",
        description:
          "Durant votre tour, ce personnage gagne Insaisissable. (Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Zipper",
    version: "Agente Speciale Volante",
    text: [
      {
        title: "AMICI DEL CUORE",
        description:
          "Se hai in gioco un personaggio chiamato Monterey Jack, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "SCATTO VELOCE",
        description:
          "Durante il tuo turno, questo personaggio ottiene Sfuggente. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
