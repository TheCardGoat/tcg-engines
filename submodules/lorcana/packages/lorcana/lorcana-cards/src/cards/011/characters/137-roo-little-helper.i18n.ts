import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rooLittleHelperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Roo",
    version: "Little Helper",
    text: [
      {
        title: "HOPPING IN",
        description:
          "{E} — Put this character facedown under one of your characters or locations with Boost.",
      },
    ],
  },
  de: {
    name: "Ruh",
    version: "Kleiner Helfer",
    text: [
      {
        title: "SPRING HINEIN",
        description:
          "— Lege diesen Charakter verdeckt unter einen deiner Charaktere oder Orte mit Stärken.",
      },
    ],
  },
  fr: {
    name: "Petit Gourou",
    version: "Petit coup de main",
    text: [
      {
        title: "GRIMPE DANS LA POCHE",
        description:
          "— Placez ce personnage, face cachée, sous l'un de vos personnages ou de vos lieux avec Boost.",
      },
    ],
  },
  it: {
    name: "Ro",
    version: "Piccolo Aiutante",
    text: [
      {
        title: "SALTARE DENTRO",
        description:
          "— Metti questo personaggio a faccia in giù sotto a uno dei tuoi personaggi o luoghi con Potenziamento.",
      },
    ],
  },
};
