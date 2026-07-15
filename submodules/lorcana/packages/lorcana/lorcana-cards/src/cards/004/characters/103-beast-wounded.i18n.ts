import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastWoundedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast",
    version: "Wounded",
    text: [
      {
        title: "THAT HURTS!",
        description: "This character enters play with 4 damage.",
      },
    ],
  },
  de: {
    name: "Biest",
    version: "Verwundet",
    text: [
      {
        title: "Das tut weh!",
        description: "Dieser Charakter kommt mit 4 Schaden auf ihm ins Spiel.",
      },
    ],
  },
  fr: {
    name: "La Bête",
    version: "Blessée",
    text: [
      {
        title: "Mais ça fait mal!",
        description: "Ce personnage entre en jeu avec 4 jetons Dommage.",
      },
    ],
  },
  it: {
    name: "La Bestia",
    version: "Ferita",
    text: [
      {
        title: "Fa Male!",
        description: "Questo personaggio entra in gioco con 4 danni.",
      },
    ],
  },
};
