import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPansShadowNotSewnOnI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan's Shadow",
    version: "Not Sewn On",
    text: [
      {
        title: "Rush",
      },
      {
        title: "Evasive",
      },
      {
        title: "TIPTOE",
        description: "Your other characters with Rush gain Evasive.",
      },
    ],
  },
  de: {
    name: "Peter Pans Schatten",
    version: "Nicht angenäht",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "<Rasant>",
      },
      {
        title: "Auf Zehenspitzen",
        description: "Deine anderen Charaktere mit <Rasant> erhalten <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Ombre de Peter Pan",
    version: "Décousue",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "<Charge>",
      },
      {
        title: "Sur la pointe des pieds",
        description: "Vos autres personnages avec <Charge> gagnent <Insaisissable>.",
      },
    ],
  },
  it: {
    name: "Peter Pan's Shadow",
    version: "Not Sewn On",
    text: [
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "<Rush> (This character can challenge the turn they're played.)",
      },
      {
        title: "Tiptoe",
        description: "Your other characters with <Rush> gain <Evasive>.",
      },
    ],
  },
  es: {
    name: "La sombra de Peter Pan",
    version: "No cosido",
    text: [
      {
        title: "Correr",
      },
      {
        title: "Evasivo",
      },
      {
        title: "PUNTA DEL PIE",
        description: "Tus otros personajes con Rush obtienen Evasivo.",
      },
    ],
  },
};
