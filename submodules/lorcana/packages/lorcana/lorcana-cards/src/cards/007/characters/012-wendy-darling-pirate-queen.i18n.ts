import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wendyDarlingPirateQueenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wendy Darling",
    version: "Pirate Queen",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "TELL NO TALES",
        description:
          "Whenever one of your other characters is banished, you may remove all damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Wendy Darling",
    version: "Piratenkönigin",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "ERZÄHL KEINE MÄRCHEN",
        description:
          "Jedes Mal, wenn einer deiner anderen Charaktere verbannt wird, darfst du jeglichen Schaden von einem Charakter deiner Wahl entfernen.",
      },
    ],
  },
  fr: {
    name: "Wendy Darling",
    version: "Reine Pirate",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "NE RACONTE PAS D'HISTOIRES",
        description:
          "Chaque fois que l'un de vos autres personnages est banni, vous pouvez choisir un personnage et lui retirer tous ses dommages.",
      },
    ],
  },
  it: {
    name: "Wendy Darling",
    version: "Regina Pirata",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title:
          "I MORTI NON PARLANO Ogni volta che uno dei tuoi altri personaggi viene esiliato, puoi rimuovere tutti i danni da un personaggio a tua scelta.",
      },
    ],
  },
};
