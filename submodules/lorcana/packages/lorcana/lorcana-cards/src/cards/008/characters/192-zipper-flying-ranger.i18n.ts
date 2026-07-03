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
        title: "Beste Kumpel",
        description:
          "Wenn du einen Samson-Charakter im Spiel hast, zahlst du 1 {I} weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Geschwindigkeitsschub",
        description:
          "In deinem Zug erhält dieser Charakter <Wendig>. (Er kann Charaktere mit Wendig herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Ruzor",
    version: "Ranger volant",
    text: [
      {
        title: "Meilleurs copains",
        description:
          "Jouer ce personnage vous coûte 1 {I} de moins si vous avez un personnage Jack le Costaud en jeu.",
      },
      {
        title: "Accélération",
        description:
          "Durant votre tour, ce personnage gagne <Insaisissable>. (Il peut défier des personnages avec Insaisissable.)",
      },
    ],
  },
  it: {
    name: "Zipper",
    version: "Agente Speciale Volante",
    text: [
      {
        title: "Amici del Cuore",
        description:
          "Se hai in gioco un personaggio chiamato Monterey Jack, paga 1 {I} in meno per giocare questo personaggio.",
      },
      {
        title: "Scatto Veloce",
        description:
          "Durante il tuo turno, questo personaggio ottiene <Sfuggente>. (Può sfidare altri personaggi con Sfuggente.)",
      },
    ],
  },
};
