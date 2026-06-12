import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dinnerBellI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dinner Bell",
    text: [
      {
        title: "YOU KNOW WHAT HAPPENS",
        description:
          "{E}, 2 {I} — Draw cards equal to the damage on chosen character of yours, then banish them.",
      },
    ],
  },
  de: {
    name: "Tischglocke",
    text: [
      {
        title: "DU WEISST, WAS PASSIERT, 2",
        description:
          "— Wähle einen deiner Charaktere und zähle den Schaden auf ihm. Ziehe diese Anzahl an Karten und verbanne den Charakter anschließend.",
      },
    ],
  },
  fr: {
    name: "Clochette du dîner",
    text: [
      {
        title: "TU SAIS CE QUI SE PASSE, 2",
        description:
          "— Choisissez l'un de vos personnages blessés et piochez une carte pour chaque jeton Dommage sur lui, puis bannissez-le.",
      },
    ],
  },
  it: {
    name: "Dinner Bell",
    text: [
      {
        title: "YOU KNOW WHAT HAPPENS, 2",
        description:
          "— Draw cards equal to the damage on chosen character of yours, then banish them.",
      },
    ],
  },
};
