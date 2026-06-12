import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const webbysDiaryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Webby's Diary",
    text: [
      {
        title: "LATEST ENTRY",
        description:
          "Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
      },
    ],
  },
  de: {
    name: "Nickys Tagebuch",
    text: [
      {
        title: "NEUESTER EINTRAG",
        description:
          "Jedes Mal, wenn du eine Karte unter einen deiner Charaktere oder Orte legst, darfst du 1 bezahlen, um 1 Karte zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Le journal de Zaza",
    text: [
      {
        title: "DERNIÈRE NOTE EN DATE",
        description:
          "Chaque fois que vous placez une carte sous l'un de vos personnages ou de vos lieux, vous pouvez payer 1 pour piocher une carte.",
      },
    ],
  },
  it: {
    name: "Diario di Gaia",
    text: [
      {
        title: "ULTIMA ANNOTAZIONE",
        description:
          "Ogni volta che metti una carta sotto a uno dei tuoi personaggi o luoghi, puoi pagare 1 per pescare una carta.",
      },
    ],
  },
};
