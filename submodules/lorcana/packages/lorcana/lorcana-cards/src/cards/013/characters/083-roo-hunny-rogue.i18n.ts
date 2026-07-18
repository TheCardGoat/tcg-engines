import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rooHunnyRogueI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Roo",
    version: "Hunny Rogue",
    text: [
      {
        title: "Ward",
      },
      {
        title: "ELUSIVE EXPERTISE",
        description:
          "While you have another Hunny character in play, this character gains Evasive.",
      },
    ],
  },
  de: {
    name: "Ruh",
    version: "Honig-Schlingel",
    text: [
      {
        title: "<Behütet>",
      },
      {
        title: "Flüchtiges Fachwissen",
        description:
          "Solange du mindestens einen weiteren Honig-Charakter im Spiel hast, erhält dieser Charakter <Wendig>. (Nur Charaktere mit Wendig können ihn herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Petit Gourou",
    version: "Roublard mellifique",
    text: [
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Compétence d'évasion",
        description:
          "Tant que vous avez un autre personnage Miel en jeu, ce personnage-ci gagne <Insaisissable>.",
      },
    ],
  },
  it: {
    name: "Ro",
    version: "Furfante del Miele",
    text: [
      {
        title: "<Protetto>",
      },
      {
        title: "Competenza Evasiva",
        description:
          "Mentre hai in gioco un altro personaggio Miele, questo personaggio ottiene <Sfuggente>. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
  es: {
    name: "Roo",
    version: "Miel pícaro",
    text: [
      {
        title: "Pabellón",
      },
      {
        title: "EXPERIENCIA ESQUIVA",
        description: "Mientras tengas otro personaje Hunny en juego, este personaje gana Evasivo.",
      },
    ],
  },
};
