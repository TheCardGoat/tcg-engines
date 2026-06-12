import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const arthurDeterminedSquireI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Arthur",
    version: "Determined Squire",
    text: [
      {
        title: "NO MORE BOOKS",
        description: "Skip your turn's Draw step.",
      },
    ],
  },
  de: {
    name: "Arthur",
    version: "Entschlossener Knappe",
    text: [
      {
        title: "KEINE BÜCHER MEHR",
        description: 'Überspringe den Schritt "Ziehen" in deinem Zug.',
      },
    ],
  },
  fr: {
    name: "Arthur",
    version: "Écuyer déterminé",
    text: [
      {
        title: "FINI LES LIVRES",
        description: "Passez l'étape Piocher au début de votre tour.",
      },
    ],
  },
  it: {
    name: "Artù",
    version: "Scudiero Determinato",
    text: [
      {
        title: "BASTA CON I LIBRI",
        description: "Salta il passaggio di Pesca del tuo turno.",
      },
    ],
  },
};
