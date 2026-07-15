import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theDodoOutlandishStorytellerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Dodo",
    version: "Outlandish Storyteller",
    text: [
      {
        title: "EXTRAORDINARY SITUATION",
        description: "This character gets +1 {S} for each 1 damage on him.",
      },
    ],
  },
  de: {
    name: "Der Dodo",
    version: "Schräger Geschichtenerzähler",
    text: [
      {
        title: "Eine äußerst fatale Situation",
        description: "Dieser Charakter erhält für jeden Schaden auf ihm +1 {S}.",
      },
    ],
  },
  fr: {
    name: "Dodo",
    version: "Conteur saugrenu",
    text: [
      {
        title: "C'est une situation extraordinaire",
        description: "Ce personnage a +1 {S} pour chaque dommage sur lui.",
      },
    ],
  },
  it: {
    name: "Capitan Libeccio",
    version: "Narratore Stravagante",
    text: [
      {
        title: "Straordinaria Situazione",
        description: "Questo personaggio riceve +1 {S} per ogni singolo danno su di esso.",
      },
    ],
  },
};
