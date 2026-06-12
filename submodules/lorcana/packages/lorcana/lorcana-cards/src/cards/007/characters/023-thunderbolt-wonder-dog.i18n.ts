import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thunderboltWonderDogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Thunderbolt",
    version: "Wonder Dog",
    text: [
      {
        title: "Puppy Shift 3",
        description: "(You may pay 3 {I} to play this on top of one of your Puppy characters.)",
      },
      {
        title: "Bodyguard",
      },
    ],
  },
  de: {
    name: "Thunderbolt",
    version: "Wunderhund",
    text: [
      {
        title: "Welpen-Gestaltwandel 3",
      },
      {
        title: "Beschützen",
      },
    ],
  },
  fr: {
    name: "Ouragan",
    version: "Chien prodigieux",
    text: [
      {
        title: "Alter de Chiot 3",
      },
      {
        title: "Rempart",
      },
    ],
  },
  it: {
    name: "Fulmine",
    version: "Cane Prodigio",
    text: [
      {
        title: "Trasformazione Cucciolo 3",
        description:
          "(Puoi pagare 3 per giocare questa carta sopra a uno dei tuoi personaggi Cucciolo.)",
      },
      {
        title: "Guardiano",
      },
    ],
  },
};
