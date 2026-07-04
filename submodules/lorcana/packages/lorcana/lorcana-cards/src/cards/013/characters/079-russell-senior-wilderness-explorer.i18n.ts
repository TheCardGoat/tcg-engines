import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const russellSeniorWildernessExplorerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Russell",
    version: "Senior Wilderness Explorer",
    text: [
      {
        title: "<Shift> 3 {I}",
      },
      {
        title: "Base Camp",
        description: "Your characters at locations get +1 {S}.",
      },
      {
        title: "Good Leadership",
        description: "Whenever one of your characters with 4 {S} or more quests, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Russel",
    version: "Erfahrener Naturforscher",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Russel auszuspielen.)",
      },
      {
        title: "Basiscamp",
        description: "Deine Charaktere an Orten erhalten +1 {S}.",
      },
      {
        title: "Gute Führung",
        description:
          "Jedes Mal, wenn einer deiner Charaktere mit 4 oder mehr {S} erkundet, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Russell",
    version: "Explorateur de la nature confirmé",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé Russell.)",
      },
      {
        title: "Camp de base",
        description: "Vos personnages sur des lieux gagnent +1 {S}.",
      },
      {
        title: "Bon meneur",
        description:
          "Chaque fois que l'un de vos personnages avec 4 {S} ou plus est envoyé à l'aventure, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Russell",
    version: "Esploratore Scelto della Natura Selvaggia",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Russell.)",
      },
      {
        title: "Campo Base",
        description: "I tuoi personaggi che si trovano in un luogo ricevono +1 {S}.",
      },
      {
        title: "Ottima Leadership",
        description:
          "Ogni volta che uno dei tuoi personaggi con 4 {S} o superiore va all'avventura, ottieni 1 leggenda.",
      },
    ],
  },
};
