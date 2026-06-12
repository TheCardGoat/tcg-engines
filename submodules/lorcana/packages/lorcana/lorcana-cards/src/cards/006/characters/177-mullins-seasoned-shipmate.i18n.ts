import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mullinsSeasonedShipmateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mullins",
    version: "Seasoned Shipmate",
    text: [
      {
        title: "FALL IN LINE",
        description:
          "While you have a character named Mr. Smee in play, this character gains Resist +1.",
      },
    ],
  },
  de: {
    name: "Mullins",
    version: "Erfahrener Schiffskamerad",
    text: [
      {
        title: "EINORDNEN",
        description:
          "Solange du mindestens einen Herr-Smee-Charakter im Spiel hast, erhält dieser Charakter Robust +1. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Mullins",
    version: "Membre d’équipage chevronné",
    text: [
      {
        title: "RENTRER DANS LE RANG",
        description:
          "Tant que vous avez un personnage Monsieur Mouche en jeu, ce personnage-ci gagne Résistance +1.",
      },
    ],
  },
  it: {
    name: "Mullins",
    version: "Marinaio Esperto",
    text: [
      {
        title: "METTERSI IN RIGA",
        description:
          "Mentre hai in gioco un personaggio chiamato Spugna, questo personaggio ottiene Resistere +1.",
      },
    ],
  },
};
