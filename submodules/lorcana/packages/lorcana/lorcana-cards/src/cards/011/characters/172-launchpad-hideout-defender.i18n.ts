import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const launchpadHideoutDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Launchpad",
    version: "Hideout Defender",
    text: [
      {
        title: "STAND GUARD",
        description: "Your locations gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Quack, der Bruchpilot",
    version: "Verteidiger des Verstecks",
    text: [
      {
        title: "WACHE STEHEN",
        description:
          "Deine Orte erhalten Robust +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Flagada Jones",
    version: "Défenseur de la cachette",
    text: [
      {
        title: "MONTE LA GARDE",
        description: "Vos lieux gagnent Résistance +1.",
      },
    ],
  },
  it: {
    name: "Jet",
    version: "Difensore del Nasondiglio",
    text: [
      {
        title: "FARE LA GUARDIA I",
        description: "tuoi luoghi ottengono Resistere +1.",
      },
    ],
  },
};
