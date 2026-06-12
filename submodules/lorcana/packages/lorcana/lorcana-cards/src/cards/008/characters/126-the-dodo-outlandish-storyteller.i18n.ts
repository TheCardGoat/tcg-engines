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
        title: "EINE ÄUSSERST FATALE SITUATION",
        description: "Dieser Charakter erhält für jeden Schaden auf ihm +1.",
      },
    ],
  },
  fr: {
    name: "Dodo",
    version: "Conteur saugrenu",
    text: [
      {
        title: "C'EST UNE SITUATION EXTRAORDINAIRE",
        description: "Ce personnage a +1 pour chaque dommage sur lui.",
      },
    ],
  },
  it: {
    name: "Capitan Libeccio",
    version: "Narratore Stravagante",
    text: [
      {
        title: "STRAORDINARIA SITUAZIONE",
        description: "Questo personaggio riceve +1 per ogni singolo danno su di esso.",
      },
    ],
  },
};
