import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const elsaTheFifthSpiritI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Elsa",
    version: "The Fifth Spirit",
    text: [
      {
        title: "Rush",
      },
      {
        title: "Evasive",
      },
      {
        title: "CRYSTALLIZE",
        description: "When you play this character, exert chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Elsa",
    version: "Der fünfte Geist",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Kristallisieren",
        description:
          "Wenn du diesen Charakter ausspielst, erschöpfe einen gegnerischen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Elsa",
    version: "Le cinquième esprit",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Cristallisation",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Elsa",
    version: "Il Quinto Spirito",
    text: [
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "<Sfuggente>",
      },
      {
        title: "Cristallizzare",
        description:
          "Quando giochi questo personaggio, impegna un personaggio avversario a tua scelta.",
      },
    ],
  },
  es: {
    name: "Elsa",
    version: "El quinto espíritu",
    text: [
      {
        title: "Correr",
      },
      {
        title: "Evasivo",
      },
      {
        title: "CRISTALIZAR",
        description: "Cuando juegues con este personaje, ejerce el personaje contrario elegido.",
      },
    ],
  },
};
