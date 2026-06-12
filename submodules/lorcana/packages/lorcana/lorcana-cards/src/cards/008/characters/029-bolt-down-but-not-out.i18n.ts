import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const boltDownButNotOutI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bolt",
    version: "Down but Not Out",
    text: [
      {
        title: "NONE OF YOUR POWERS ARE WORKING",
        description: "This character enters play exerted.",
      },
    ],
  },
  de: {
    name: "Bolt",
    version: "Am Boden, aber nicht am Ende",
    text: [
      {
        title: "DEINE SUPERKRÄFTE FUNKTIONIEREN NICHT",
        description: "Dieser Charakter kommt erschöpft ins Spiel.",
      },
    ],
  },
  fr: {
    name: "Volt",
    version: "Abattu mais pas vaincu",
    text: [
      {
        title: "TOUS TES POUVOIRS ONT DISPARU",
        description: "Ce personnage entre en jeu épuisé.",
      },
    ],
  },
  it: {
    name: "Bolt",
    version: "Abbattuto ma Non Sconfitto",
    text: [
      {
        title: "I TUOI POTERI NON FUNZIONANO",
        description: "Questo personaggio entra in gioco impegnato.",
      },
    ],
  },
};
