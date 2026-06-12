import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const isabelaMadrigalGoldenChildI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Isabela Madrigal",
    version: "Golden Child",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "LADIES FIRST",
        description:
          "During your turn, if no other character has quested this turn, this character gets +3 {L}.",
      },
      {
        title: "LEAVE IT TO ME",
        description:
          "Whenever this character quests, your other characters can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Isabela Madrigal",
    version: "Perfekt, nicht ohne Grund",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "LADIES FIRST",
        description:
          "Solange in deinem Zug noch keiner deiner anderen Charaktere erkundet hat, erhält dieser Charakter +3.",
      },
      {
        title: "ÜBERLASST DAS MIR",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, können deine anderen Charakere in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Isabela Madrigal",
    version: "Enfant chérie",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "LES FEMMES D'ABORD",
        description:
          "Tant qu'aucun autre personnage n'a été envoyé à l'aventure durant ce tour, ce personnage gagne +3.",
      },
      {
        title: "LAISSEZ-MOI FAIRE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos autres personnages ne peuvent pas être envoyés à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Isabela Madrigal",
    version: "Il Più Bel Fiore",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "PRIMA LE SIGNORE",
        description:
          "Durante il tuo turno, se nessun altro personaggio è andato all'avventura in questo turno, questo personaggio riceve +3.",
      },
      {
        title: "LASCIA FARE",
        description:
          "A ME Ogni volta che questo personaggio va all'avventura, i tuoi altri personaggi non possono andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
