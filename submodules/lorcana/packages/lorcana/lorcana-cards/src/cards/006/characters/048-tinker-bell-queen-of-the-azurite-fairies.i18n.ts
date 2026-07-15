import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tinkerBellQueenOfTheAzuriteFairiesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tinker Bell",
    version: "Queen of the Azurite Fairies",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Evasive",
      },
      {
        title: "SHINING EXAMPLE",
        description:
          "Whenever this character quests, your other Fairy characters get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Naseweis",
    version: "Königin der Azurblauen Feen",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Naseweis-Charaktere auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Glänzendes Beispiel",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten deine anderen Feen in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "La Fée Clochette",
    version: "Reine des fées d’Azurite",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages La Fée Clochette.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Modèle rayonnant",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos autres personnages Fée gagnent +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Trilli",
    version: "Regina delle Fate di Azzurrite",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Trilli.)",
      },
      {
        title: "<Sfuggente>",
      },
      {
        title: "Fulgido Esempio",
        description:
          "Ogni volta che questo personaggio va all'avventura, i tuoi altri personaggi Fata ricevono +1 {L} per questo turno.",
      },
    ],
  },
};
