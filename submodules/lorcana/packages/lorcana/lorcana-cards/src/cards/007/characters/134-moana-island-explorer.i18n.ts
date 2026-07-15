import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const moanaIslandExplorerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Moana",
    version: "Island Explorer",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "ADVENTUROUS SPIRIT",
        description:
          "Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Vaiana",
    version: "Erforscherin von Inseln",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Abenteuergeist",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, wähle einen deiner anderen Charaktere. Jener erhält in diesem Zug +3 {S}.",
      },
    ],
  },
  fr: {
    name: "Vaiana",
    version: "Exploratrice d'île",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Esprit d'aventure",
        description:
          "Chaque fois que ce personnage en défie un autre, choisissez un autre de vos personnages qui gagne +3 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Vaiana",
    version: "Esploratrice dell'Isola",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Spirito Avventuroso",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, un tuo altro personaggio a tua scelta riceve +3 {S} per questo turno.",
      },
    ],
  },
};
