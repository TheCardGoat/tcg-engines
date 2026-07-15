import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wreckitRalphRagingWreckerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wreck-it Ralph",
    version: "Raging Wrecker",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "POWERED UP",
        description: "This character gets +1 {S} for each card under him.",
      },
      {
        title: "WHO'S COMIN' WITH ME?",
        description:
          "When this character is banished, banish all characters with {S} equal to or less than the {S} he had in play.",
      },
    ],
  },
  de: {
    name: "Randale Ralph",
    version: "Rasender Zerstörer",
    text: [
      {
        title:
          "<Stärken> 1 {I} (Einmal während deines Zuges darfst du 1 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Angestachelt",
        description: "Dieser Charakter erhält für jede Karte unter ihm +1 {S}.",
      },
      {
        title: "Wer kommt mit mir?",
        description:
          "Wenn dieser Charakter verbannt wird, verbanne alle Charaktere mit genauso viel oder weniger {S}, wie dieser Charakter {S} im Spiel hatte.",
      },
    ],
  },
  fr: {
    name: "Ralph la Casse",
    version: "Démolisseur déchaîné",
    text: [
      {
        title:
          "<Boost> 1 {I} (Une fois durant votre tour, vous pouvez payer 1 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Power up",
        description: "Ce personnage gagne +1 {S} pour chaque carte sous lui.",
      },
      {
        title: "Qui vient avec moi?",
        description:
          "Lorsque ce personnage est banni, bannissez tous les personnages ayant une {S} inférieure ou égale à la {S} qu'il avait en jeu.",
      },
    ],
  },
  it: {
    name: "Ralph Spaccatutto",
    version: "Spaccatore Impetuoso",
    text: [
      {
        title:
          "<Potenziamento> 1 {I} (Una volta durante il tuo turno, puoi pagare 1 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Caricato",
        description: "Questo personaggio riceve +1 {S} per ogni carta sotto di sé.",
      },
      {
        title: "Chi Viene con Me?",
        description:
          "Quando questo personaggio viene esiliato, esilia tutti i personaggi con {S} uguale o inferiore alla {S} che aveva in gioco.",
      },
    ],
  },
};
