import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastWolfsbaneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast",
    version: "Wolfsbane",
    text: [
      {
        title: "Rush",
      },
      {
        title: "ROAR",
        description: "When you play this character, exert all opposing damaged characters.",
      },
    ],
  },
  de: {
    name: "Biest",
    version: "Schrecken der Wölfe",
    text: "<Rasant> \\Brüllen\\ Wenn du diesen Charakter ausspielst, erschöpfe alle gegnerischen beschädigten Charaktere.",
  },
  fr: {
    name: "LA BÊTE",
    version: "Fléau des loups",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "RUGISSEMENT",
        description:
          "Lorsque vous jouez ce personnage, épuisez tous les personnages adverses ayant des jetons Dommage.",
      },
    ],
  },
  it: {
    name: "Beast",
    version: "Wolfsbane",
    text: [
      {
        title: "<Rush> (This character can challenge the turn they're played.)",
      },
      {
        title: "Roar",
        description: "When you play this character, exert all opposing damaged characters.",
      },
    ],
  },
  es: {
    name: "Bestia",
    version: "Acónito",
    text: [
      {
        title: "Correr",
      },
      {
        title: "RUGIDO",
        description:
          "Cuando juegues con este personaje, ejerce todos los personajes dañados del oponente.",
      },
    ],
  },
};
