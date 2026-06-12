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
        title: "Stärken 1",
      },
      {
        title: "ANGESTACHELT",
        description: "Dieser Charakter erhält für jede Karte unter ihm +1.",
      },
      {
        title: "WER KOMMT MIT MIR?",
        description:
          "Wenn dieser Charakter verbannt wird, verbanne alle Charaktere mit genauso viel oder weniger, wie dieser Charakter im Spiel hatte.",
      },
    ],
  },
  fr: {
    name: "Ralph la Casse",
    version: "Démolisseur déchaîné",
    text: [
      {
        title: "Boost 1",
      },
      {
        title: "POWER UP",
        description: "Ce personnage gagne +1 pour chaque carte sous lui.",
      },
      {
        title: "QUI VIENT AVEC MOI?",
        description:
          "Lorsque ce personnage est banni, bannissez tous les personnages ayant une inférieure ou égale à la qu'il avait en jeu.",
      },
    ],
  },
  it: {
    name: "Ralph Spaccatutto",
    version: "Spaccatore Impetuoso",
    text: [
      {
        title: "Potenziamento 1",
      },
      {
        title: "CARICATO",
        description: "Questo personaggio riceve +1 per ogni carta sotto di sé.",
      },
      {
        title: "CHI VIENE CON ME?",
        description:
          "Quando questo personaggio viene esiliato, esilia tutti i personaggi con uguale o inferiore alla che aveva in gioco.",
      },
    ],
  },
};
