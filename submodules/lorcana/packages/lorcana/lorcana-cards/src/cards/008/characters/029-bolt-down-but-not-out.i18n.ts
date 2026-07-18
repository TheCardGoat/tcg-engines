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
        title: "Deine Superkräfte funktionieren nicht",
        description: "Dieser Charakter kommt erschöpft ins Spiel.",
      },
    ],
  },
  fr: {
    name: "Volt",
    version: "Abattu mais pas vaincu",
    text: [
      {
        title: "Tous tes pouvoirs ont disparu",
        description: "Ce personnage entre en jeu épuisé.",
      },
    ],
  },
  it: {
    name: "Bolt",
    version: "Abbattuto ma Non Sconfitto",
    text: [
      {
        title: "I Tuoi Poteri non Funzionano",
        description: "Questo personaggio entra in gioco impegnato.",
      },
    ],
  },
  es: {
    name: "Tornillo",
    version: "Abajo pero no afuera",
    text: [
      {
        title: "NINGUNO DE TUS PODERES ESTÁ FUNCIONANDO",
        description: "Este personaje entra en juego ejercido.",
      },
    ],
  },
};
