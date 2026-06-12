import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mirabelMadrigalFamilyGathererI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mirabel Madrigal",
    version: "Family Gatherer",
    text: [
      {
        title: "NOT WITHOUT MY FAMILY",
        description: "You can't play this character unless you have 5 or more characters in play.",
      },
    ],
  },
  de: {
    name: "Mirabel Madrigal",
    version: "Führt die Familie zusammen",
    text: [
      {
        title: "NICHT OHNE MEINE FAMILIE",
        description:
          "Du kannst diesen Charakter nicht ausspielen, außer du hast mindestens 5 Charaktere im Spiel.",
      },
    ],
  },
  fr: {
    name: "Mirabel Madrigal",
    version: "Rassembleuse de la Famille",
    text: [
      {
        title: "PAS SANS MA FAMILLE",
        description:
          "Vous ne pouvez pas jouer ce personnage à moins d'avoir 5 personnages ou plus en jeu.",
      },
    ],
  },
  it: {
    name: "Mirabel Madrigal",
    version: "Che Riunisce la Famiglia",
    text: [
      {
        title: "NON SENZA LA MIA FAMIGLIA",
        description:
          "Non puoi giocare questo personaggio a meno che tu non abbia in gioco 5 o più personaggi.",
      },
    ],
  },
};
